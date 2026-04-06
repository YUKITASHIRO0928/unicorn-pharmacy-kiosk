"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import UnicornCharacter from "../UnicornCharacter";
import SpeechBubble from "../SpeechBubble";
import BigButton from "../ui/BigButton";
import { CharacterType } from "../../lib/characters";
import { speak, stopSpeaking } from "../../lib/speech";

type HomeScreenProps = {
  character: CharacterType;
  onSelectFirst: () => void;
  onSelectRegular: () => void;
  onToggleCharacter: () => void;
};

export default function HomeScreen({
  character,
  onSelectFirst,
  onSelectRegular,
  onToggleCharacter,
}: HomeScreenProps) {
  useEffect(() => {
    speak("こんにちは！ボタンをタッチしてね", character);
    return () => stopSpeaking();
  }, [character]);

  return (
    <motion.div
      className="flex flex-col items-center justify-between h-full px-[5vw] relative z-10"
      style={{ paddingTop: "4vh", paddingBottom: "2vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
    >
      {/* 薬局名 - 十分なマージン確保 */}
      <motion.h1
        className="font-black tracking-[0.12em] title-text shrink-0"
        style={{ fontSize: "clamp(1.8rem, 4.5vh, 4.5rem)" }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        ユニコーン薬局
      </motion.h1>

      {/* 吹き出し */}
      <div className="shrink-0" style={{ marginTop: "1.5vh" }}>
        <SpeechBubble text="こんにちは！ボタンをタッチしてね" show />
      </div>

      {/* キャラクター - flex-1で残りスペースに収まる */}
      <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden" style={{ padding: "1vh 0" }}>
        <UnicornCharacter character={character} pose="home" sizeVh={28} />
      </div>

      {/* ボタン */}
      <div className="flex flex-col w-full shrink-0" style={{ gap: "1.5vh", maxWidth: "85vw" }}>
        <BigButton
          label="はじめてのかた"
          onClick={onSelectFirst}
          color="secondary"
          size="large"
          icon="🌟"
        />
        <BigButton
          label="いつものかた"
          onClick={onSelectRegular}
          color="primary"
          size="large"
          icon="💜"
        />
      </div>

      {/* キャラ切り替え */}
      <motion.button
        onClick={onToggleCharacter}
        className="shrink-0 text-[#9b7cc0] font-medium tracking-wide
          rounded-full bg-white/50 backdrop-blur-sm
          border border-[#d4c4e8]/40
          hover:bg-white/70 transition-colors"
        style={{ fontSize: "clamp(0.8rem, 1.5vh, 1.5rem)", padding: "1vh 3vw", marginTop: "1vh" }}
        whileTap={{ scale: 0.95 }}
      >
        🔄 キャラクターをきりかえる
      </motion.button>
    </motion.div>
  );
}
