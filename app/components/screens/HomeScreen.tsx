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
      className="flex flex-col items-center h-full px-[4vw] relative z-10"
      style={{ paddingTop: "3vh", paddingBottom: "2vh", gap: "2vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <motion.h1
        className="font-black tracking-[0.15em] title-text"
        style={{ fontSize: "clamp(2rem, 5vh, 5rem)" }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        ユニコーン薬局
      </motion.h1>

      <SpeechBubble text="こんにちは！ボタンをタッチしてね" show />

      <div className="flex-1 flex items-center justify-center min-h-0">
        <UnicornCharacter character={character} pose="home" sizeVh={32} />
      </div>

      <div className="flex flex-col w-full" style={{ gap: "2vh", maxWidth: "80vw" }}>
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

      <motion.button
        onClick={onToggleCharacter}
        className="text-[1.2rem] text-[#9b7cc0] font-medium tracking-wide
          px-6 py-3 rounded-full
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
