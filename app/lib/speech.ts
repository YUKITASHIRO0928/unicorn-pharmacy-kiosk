// VOICEVOX音声合成 + Web Speech APIフォールバック
// Windows運用時: VOICEVOXエンジンをCORS許可で起動
//   "C:\Program Files\VOICEVOX\vv-engine\run.exe" --host 127.0.0.1 --port 50021 --cors_policy_mode all

export type CharacterVoice = "medicoorn" | "lunabelle";

// VOICEVOXスピーカーID
const VOICEVOX_SPEAKERS: Record<CharacterVoice, number> = {
  medicoorn: 2,   // 四国めたん（ノーマル）
  lunabelle: 3,   // ずんだもん（ノーマル）
};

const VOICEVOX_BASE = "http://localhost:50021";

let currentAudio: HTMLAudioElement | null = null;
let voicevoxAvailable: boolean | null = null;
let speakGeneration = 0;

// ========== 音声キャッシュ ==========
// キー: `${character}:${text}` → 値: Blob URL
const audioCache = new Map<string, string>();

function cacheKey(text: string, character: CharacterVoice): string {
  return `${character}:${text}`;
}

// 事前合成（バックグラウンドでキャッシュ作成）
async function synthesizeToCache(text: string, character: CharacterVoice): Promise<void> {
  const key = cacheKey(text, character);
  if (audioCache.has(key)) return;

  try {
    const speakerId = VOICEVOX_SPEAKERS[character];
    const queryRes = await fetch(
      `${VOICEVOX_BASE}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
      { method: "POST" }
    );
    if (!queryRes.ok) return;
    const query = await queryRes.json();

    if (character === "medicoorn") {
      query.speedScale = 1.0;
      query.pitchScale = 0.0;
      query.intonationScale = 1.2;
    } else {
      query.speedScale = 1.1;
      query.pitchScale = 0.05;
      query.intonationScale = 1.4;
    }

    const synthRes = await fetch(
      `${VOICEVOX_BASE}/synthesis?speaker=${speakerId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      }
    );
    if (!synthRes.ok) return;

    const blob = await synthRes.blob();
    const url = URL.createObjectURL(blob);
    audioCache.set(key, url);
  } catch {
    // キャッシュ失敗は無視（実行時にリアルタイム合成にフォールバック）
  }
}

// 全セリフを事前キャッシュ
const ALL_LINES = [
  "こんにちは！ボタンをタッチしてね",
  "おくすり手帳はお持ちですか？",
  "ジェネリックいやくひんのご準備でよろしいでしょうか？",
  "せんぱつひんを選択された場合、せんていりょうようひとして追加の費用がかかります",
  "アンケートのご記入をお願いします",
  "QRコードをスマートフォンで読み取ってください",
  "用紙をお渡ししますので、お席でお待ちください",
  "ありがとうございます！",
];

export async function preloadAllAudio() {
  if (typeof window === "undefined") return;

  const available = await checkVoicevox();
  if (!available) return;

  // 両キャラ分を並列でキャッシュ（1つずつ順番にすると時間がかかるので2並列）
  for (const line of ALL_LINES) {
    await Promise.all([
      synthesizeToCache(line, "medicoorn"),
      synthesizeToCache(line, "lunabelle"),
    ]);
  }
  // 番号付きセリフは1〜30までキャッシュ
  for (let i = 1; i <= 30; i++) {
    const text = `ばんごうふだ${i}番をお取りになり、処方せんをトレイに入れて、マイナンバーの読み取りをお願いします`;
    await Promise.all([
      synthesizeToCache(text, "medicoorn"),
      synthesizeToCache(text, "lunabelle"),
    ]);
  }
}

// ========== 接続チェック ==========
async function checkVoicevox(): Promise<boolean> {
  try {
    const res = await fetch(`${VOICEVOX_BASE}/version`, { signal: AbortSignal.timeout(3000) });
    voicevoxAvailable = res.ok;
  } catch {
    voicevoxAvailable = false;
  }
  return voicevoxAvailable;
}

// ========== 停止 ==========
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

// ========== VOICEVOX再生 ==========
async function speakWithVoicevox(text: string, character: CharacterVoice, gen: number): Promise<boolean> {
  try {
    const key = cacheKey(text, character);
    let audioUrl = audioCache.get(key);

    // キャッシュにない場合はリアルタイム合成
    if (!audioUrl) {
      const speakerId = VOICEVOX_SPEAKERS[character];

      const queryRes = await fetch(
        `${VOICEVOX_BASE}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
        { method: "POST" }
      );
      if (!queryRes.ok) return false;
      if (gen !== speakGeneration) return false;

      const query = await queryRes.json();
      if (character === "medicoorn") {
        query.speedScale = 1.0;
        query.pitchScale = 0.0;
        query.intonationScale = 1.2;
      } else {
        query.speedScale = 1.1;
        query.pitchScale = 0.05;
        query.intonationScale = 1.4;
      }

      const synthRes = await fetch(
        `${VOICEVOX_BASE}/synthesis?speaker=${speakerId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        }
      );
      if (!synthRes.ok) return false;
      if (gen !== speakGeneration) return false;

      const blob = await synthRes.blob();
      audioUrl = URL.createObjectURL(blob);
      audioCache.set(key, audioUrl); // 次回用にキャッシュ
    }

    if (gen !== speakGeneration) return false;
    cancelAll();

    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
    };
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

// ========== Web Speech API フォールバック ==========
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
  const jaVoice = voices.find((v) => v.lang === "ja-JP" || v.lang.startsWith("ja"));
  if (jaVoice) utterance.voice = jaVoice;
  window.speechSynthesis.speak(utterance);
}

// ========== メイン ==========
export async function speak(text: string, character: CharacterVoice) {
  if (typeof window === "undefined") return;

  const gen = ++speakGeneration;
  cancelAll();

  // キャッシュにあれば接続チェック不要で即再生
  const key = cacheKey(text, character);
  if (audioCache.has(key)) {
    const audioUrl = audioCache.get(key)!;
    if (gen !== speakGeneration) return;
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
    };
    try {
      await audio.play();
      return;
    } catch {
      // キャッシュ再生失敗時はフォールスルー
    }
  }

  const hasVoicevox = await checkVoicevox();
  if (gen !== speakGeneration) return;

  if (hasVoicevox) {
    const success = await speakWithVoicevox(text, character, gen);
    if (success) return;
    if (gen !== speakGeneration) return;
  }

  speakWithWebSpeech(text, character);
}

export function stopSpeaking() {
  ++speakGeneration;
  cancelAll();
}

// 音声プリロード
export async function preloadVoices() {
  if (typeof window === "undefined") return;
  await checkVoicevox();

  // VOICEVOXが使える場合、全セリフを事前キャッシュ開始
  if (voicevoxAvailable) {
    preloadAllAudio(); // awaitしない（バックグラウンドで実行）
  }

  return new Promise<void>((resolve) => {
    const voices = window.speechSynthesis?.getVoices();
    if (voices && voices.length > 0) { resolve(); return; }
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => resolve();
    }
    setTimeout(resolve, 3000);
  });
}
