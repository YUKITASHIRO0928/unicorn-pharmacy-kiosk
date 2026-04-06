// VOICEVOX音声合成 + Web Speech APIフォールバック
// Windows運用時: VOICEVOXエンジンをCORS許可で起動
//   "C:\Program Files\VOICEVOX\vv-engine\run.exe" --host 127.0.0.1 --port 50021 --cors_policy_mode all

export type CharacterVoice = "medicoorn" | "lunabelle";

const VOICEVOX_SPEAKERS: Record<CharacterVoice, number> = {
  medicoorn: 2,   // 四国めたん（ノーマル）
  lunabelle: 3,   // ずんだもん（ノーマル）
};

const VOICEVOX_BASE = "http://localhost:50021";

let currentAudio: HTMLAudioElement | null = null;
let voicevoxAvailable: boolean | null = null;
let speakGeneration = 0;

// ========== 音声キャッシュ ==========
const audioCache = new Map<string, string>();

function cacheKey(text: string, character: CharacterVoice): string {
  return `${character}:${text}`;
}

function getVoiceParams(character: CharacterVoice) {
  if (character === "medicoorn") {
    return { speedScale: 1.0, pitchScale: 0.0, intonationScale: 1.2 };
  }
  return { speedScale: 1.1, pitchScale: 0.05, intonationScale: 1.4 };
}

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
    Object.assign(query, getVoiceParams(character));

    const synthRes = await fetch(
      `${VOICEVOX_BASE}/synthesis?speaker=${speakerId}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(query) }
    );
    if (!synthRes.ok) return;

    const blob = await synthRes.blob();
    audioCache.set(key, URL.createObjectURL(blob));
  } catch {
    // 失敗は無視
  }
}

// ========== プリロード ==========

// 最優先: ホーム画面で最初に喋るセリフ
const PRIORITY_LINES = [
  "こんにちは！ボタンをタッチしてね",
];

// 通常優先: 各画面のセリフ
const NORMAL_LINES = [
  "おくすり手帳はお持ちですか？",
  "ジェネリックいやくひんのご準備でよろしいでしょうか？",
  "せんぱつひんを選択された場合、せんていりょうようひとして追加の費用がかかります",
  "アンケートのご記入をお願いします",
  "QRコードをスマートフォンで読み取ってください",
  "用紙をお渡ししますので、お席でお待ちください",
  "ありがとうございます！",
];

async function preloadAllAudio() {
  if (typeof window === "undefined" || !voicevoxAvailable) return;

  // 1. 最優先: ホーム画面のセリフを両キャラ同時キャッシュ
  await Promise.all([
    synthesizeToCache(PRIORITY_LINES[0], "medicoorn"),
    synthesizeToCache(PRIORITY_LINES[0], "lunabelle"),
  ]);

  // 2. 各画面セリフ
  for (const line of NORMAL_LINES) {
    await Promise.all([
      synthesizeToCache(line, "medicoorn"),
      synthesizeToCache(line, "lunabelle"),
    ]);
  }

  // 3. 番号付きセリフ（低優先、バックグラウンド）
  for (let i = 1; i <= 20; i++) {
    const withoutBook = `ばんごうふだ${i}番をお取りください。処方せんをトレイに入れて、マイナンバーの読み取りをお願いします`;
    const withBook = `ばんごうふだ${i}番をお取りください。処方せんとおくすり手帳をトレイに入れて、マイナンバーの読み取りをお願いします`;
    await Promise.all([
      synthesizeToCache(withoutBook, "medicoorn"),
      synthesizeToCache(withoutBook, "lunabelle"),
      synthesizeToCache(withBook, "medicoorn"),
      synthesizeToCache(withBook, "lunabelle"),
    ]);
  }
}

// ========== 接続チェック（高速） ==========
async function checkVoicevox(): Promise<boolean> {
  try {
    const res = await fetch(`${VOICEVOX_BASE}/version`, { signal: AbortSignal.timeout(1000) });
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

    if (!audioUrl) {
      const speakerId = VOICEVOX_SPEAKERS[character];
      console.log("[voicevox] query start");
      const queryRes = await fetch(
        `${VOICEVOX_BASE}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
        { method: "POST", signal: AbortSignal.timeout(5000) }
      );
      if (!queryRes.ok || gen !== speakGeneration) return false;
      const query = await queryRes.json();
      Object.assign(query, getVoiceParams(character));

      console.log("[voicevox] synthesis start");
      const synthRes = await fetch(
        `${VOICEVOX_BASE}/synthesis?speaker=${speakerId}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(query), signal: AbortSignal.timeout(10000) }
      );
      if (!synthRes.ok || gen !== speakGeneration) return false;

      const blob = await synthRes.blob();
      audioUrl = URL.createObjectURL(blob);
      audioCache.set(key, audioUrl);
      console.log("[voicevox] synthesis done");
    }

    if (gen !== speakGeneration) return false;
    cancelAll();

    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
    };
    await audio.play();
    console.log("[voicevox] playing");
    return true;
  } catch (e) {
    console.error("[voicevox] error:", e);
    return false;
  }
}

// ========== Web Speech API フォールバック ==========
function speakWithWebSpeech(text: string, character: CharacterVoice) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  if (character === "medicoorn") { utterance.rate = 0.9; utterance.pitch = 1.0; }
  else { utterance.rate = 1.05; utterance.pitch = 1.4; }
  const voices = window.speechSynthesis.getVoices();
  const jaVoice = voices.find((v) => v.lang === "ja-JP" || v.lang.startsWith("ja"));
  if (jaVoice) utterance.voice = jaVoice;
  window.speechSynthesis.speak(utterance);
}

// ========== メイン ==========
export async function speak(text: string, character: CharacterVoice) {
  if (typeof window === "undefined") return;

  console.log("[speak] called:", text.substring(0, 30), "...", "cache:", audioCache.has(cacheKey(text, character)), "voicevox:", voicevoxAvailable);

  const gen = ++speakGeneration;
  cancelAll();

  // キャッシュヒット → 即再生（接続チェックすらしない）
  const key = cacheKey(text, character);
  if (audioCache.has(key)) {
    console.log("[speak] cache hit, playing");
    const audio = new Audio(audioCache.get(key)!);
    currentAudio = audio;
    audio.onended = () => { if (currentAudio === audio) currentAudio = null; };
    try { await audio.play(); return; } catch (e) { console.error("[speak] cache play failed:", e); }
  }

  // キャッシュミス → VOICEVOX確認して合成
  if (voicevoxAvailable === null) {
    console.log("[speak] checking voicevox...");
    await checkVoicevox();
  }
  if (gen !== speakGeneration) { console.log("[speak] cancelled (gen mismatch after check)"); return; }

  if (voicevoxAvailable) {
    console.log("[speak] voicevox available, synthesizing...");
    const success = await speakWithVoicevox(text, character, gen);
    if (success) { console.log("[speak] voicevox success"); return; }
    if (gen !== speakGeneration) { console.log("[speak] cancelled (gen mismatch after synth)"); return; }
    console.log("[speak] voicevox failed, falling back");
  }

  console.log("[speak] using web speech api");
  speakWithWebSpeech(text, character);
}

export function stopSpeaking() {
  ++speakGeneration;
  cancelAll();
}

// ========== 初期化 ==========
export async function preloadVoices() {
  if (typeof window === "undefined") return;

  // 接続チェック（1秒タイムアウト）
  await checkVoicevox();

  if (voicevoxAvailable) {
    // 最優先セリフを即キャッシュ開始（バックグラウンド）
    preloadAllAudio();
  }

  // Web Speech API音声もロード
  return new Promise<void>((resolve) => {
    const voices = window.speechSynthesis?.getVoices();
    if (voices && voices.length > 0) { resolve(); return; }
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => resolve();
    }
    setTimeout(resolve, 2000);
  });
}
