// VOICEVOX音声合成 + Web Speech APIフォールバック
// VOICEVOX: http://localhost:50021 で起動しておく

export type CharacterVoice = "medicoorn" | "lunabelle";

// VOICEVOXスピーカーID（お好みで変更可能）
// 一覧は http://localhost:50021/speakers で確認できます
const VOICEVOX_SPEAKERS: Record<CharacterVoice, number> = {
  medicoorn: 2,   // 四国めたん（ノーマル）- 落ち着いた優しい声
  lunabelle: 3,   // ずんだもん（ノーマル）- 元気でかわいい声
};

// VOICEVOX APIのベースURL（Windows運用時はlocalhost）
const VOICEVOX_BASE = "http://localhost:50021";

let currentAudio: HTMLAudioElement | null = null;
let voicevoxAvailable: boolean | null = null;
let speakGeneration = 0; // 二重再生防止用

// VOICEVOX接続チェック
async function checkVoicevox(): Promise<boolean> {
  if (voicevoxAvailable !== null) return voicevoxAvailable;
  try {
    const res = await fetch(`${VOICEVOX_BASE}/version`, { signal: AbortSignal.timeout(2000) });
    voicevoxAvailable = res.ok;
  } catch {
    voicevoxAvailable = false;
  }
  return voicevoxAvailable;
}

// 全音声を即座に停止
function cancelAll() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== "undefined") {
    window.speechSynthesis?.cancel();
  }
}

// VOICEVOX音声合成
async function speakWithVoicevox(text: string, character: CharacterVoice, gen: number): Promise<boolean> {
  try {
    const speakerId = VOICEVOX_SPEAKERS[character];

    // 1. 音声クエリ作成
    const queryRes = await fetch(
      `${VOICEVOX_BASE}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
      { method: "POST" }
    );
    if (!queryRes.ok) return false;
    if (gen !== speakGeneration) return false; // キャンセルされた

    const query = await queryRes.json();

    // 話速・ピッチ調整
    if (character === "medicoorn") {
      query.speedScale = 1.0;
      query.pitchScale = 0.0;
      query.intonationScale = 1.2;
    } else {
      query.speedScale = 1.1;
      query.pitchScale = 0.05;
      query.intonationScale = 1.4;
    }

    // 2. 音声合成
    const synthRes = await fetch(
      `${VOICEVOX_BASE}/synthesis?speaker=${speakerId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      }
    );
    if (!synthRes.ok) return false;
    if (gen !== speakGeneration) return false; // キャンセルされた

    // 3. 音声再生
    const audioBlob = await synthRes.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    if (gen !== speakGeneration) {
      URL.revokeObjectURL(audioUrl);
      return false;
    }

    cancelAll(); // 念のため

    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      if (currentAudio === audio) currentAudio = null;
    };
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

// Web Speech API フォールバック
function speakWithWebSpeech(text: string, character: CharacterVoice) {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";

  if (character === "medicoorn") {
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
  } else {
    utterance.rate = 1.05;
    utterance.pitch = 1.4;
  }

  const voices = window.speechSynthesis.getVoices();
  const jaVoice = voices.find(
    (v) => v.lang === "ja-JP" || v.lang.startsWith("ja")
  );
  if (jaVoice) utterance.voice = jaVoice;

  window.speechSynthesis.speak(utterance);
}

// メイン関数: VOICEVOX優先、失敗時はWeb Speech APIにフォールバック
// 呼ぶたびにgenerationを上げ、前回の非同期処理を無効化する
export async function speak(text: string, character: CharacterVoice) {
  if (typeof window === "undefined") return;

  // 前の再生をすべてキャンセル
  const gen = ++speakGeneration;
  cancelAll();

  const hasVoicevox = await checkVoicevox();
  if (gen !== speakGeneration) return; // 別のspeakが呼ばれた

  if (hasVoicevox) {
    const success = await speakWithVoicevox(text, character, gen);
    if (success) return;
    if (gen !== speakGeneration) return;
  }

  // フォールバック
  speakWithWebSpeech(text, character);
}

export function stopSpeaking() {
  ++speakGeneration; // 進行中の非同期もキャンセル
  cancelAll();
}

// 音声プリロード
export async function preloadVoices() {
  if (typeof window === "undefined") return;

  // VOICEVOXの接続チェック
  await checkVoicevox();

  // Web Speech APIの音声もロード
  return new Promise<void>((resolve) => {
    const voices = window.speechSynthesis?.getVoices();
    if (voices && voices.length > 0) {
      resolve();
      return;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => resolve();
    }
    setTimeout(resolve, 3000);
  });
}
