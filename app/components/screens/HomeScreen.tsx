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
      className="flex flex-col items-center h-full px-6 relative z-10"
      style={{ paddingTop: "4vh", paddingBottom: "3vh", gap: "2.5vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
    >
      {/* 薬局名 */}
      <motion.h1
        className="text-[2.8rem] font-black tracking-[0.15em] title-text"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        ユニコーン薬局
      </motion.h1>

      {/* 吹き出し */}
      <SpeechBubble text="こんにちは！ボタンをタッチしてね" show />

      {/* キャラクター */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <UnicornCharacter character={character} pose="home" size={280} />
      </div>

      {/* ボタン */}
      <div className="flex flex-col gap-4 w-full max-w-[460px]">
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
        className="text-base text-[#9b7cc0] font-medium tracking-wide
          px-5 py-2 rounded-full
          bg-white/50 backdrop-blur-sm
          border border-[#d4c4e8]/40
          hover:bg-white/70 transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        🔄 キャラクターをきりかえる
      </motion.button>
    </motion.div>
  );
}
