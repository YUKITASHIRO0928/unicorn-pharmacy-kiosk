"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import UnicornCharacter from "../UnicornCharacter";
import SpeechBubble from "../SpeechBubble";
import { CharacterType } from "../../lib/characters";
import { speak, stopSpeaking } from "../../lib/speech";

type CompleteScreenProps = {
  character: CharacterType;
  receptionNumber: number;
  onComplete: () => void;
};

export default function CompleteScreen({
  character,
  receptionNumber,
  onComplete,
}: CompleteScreenProps) {
  useEffect(() => {
    speak(
      `番号札${receptionNumber}番をお取りになり、処方せんをトレイに入れて、マイナンバーの読み取りをお願いします`,
      character
    );
    const timer = setTimeout(onComplete, 10000);
    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [character, receptionNumber, onComplete]);

  // キラキラパーティクル
  const sparkles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      emoji: ["✨", "⭐", "💫", "🌟", "✦", "♡"][i % 6],
      x: 8 + Math.random() * 84,
      y: 8 + Math.random() * 84,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random() * 1.5,
      size: 18 + Math.random() * 16,
    }));
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center h-full px-6 relative z-10"
      style={{ paddingTop: "3vh", paddingBottom: "3vh", gap: "2vh" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* キラキラエフェクト */}
      {sparkles.map((s, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: `${s.size}px`, zIndex: 5 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.3, 1.3, 0.3],
            rotate: [0, 180, 360],
            y: [0, -20, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
          }}
        >
          {s.emoji}
        </motion.div>
      ))}

      {/* 吹き出し */}
      <SpeechBubble text="ありがとうございます！" show />

      {/* キャラクター */}
      <UnicornCharacter character={character} pose="happy" size={220} floating />

      {/* 受付番号カード */}
      <motion.div
        className="rounded-[2rem] px-12 py-6 text-center relative z-10"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.97), rgba(248,244,255,0.97))",
          boxShadow: "0 8px 32px rgba(124,91,173,0.18), 0 0 0 2px rgba(200,180,230,0.2)",
        }}
        initial={{ scale: 0, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 180 }}
      >
        <p className="text-xl text-[#9b7cc0] font-bold mb-1 tracking-wide">
          🎫 番号札をお取りください
        </p>
        <p
          className="font-black leading-none"
          style={{
            fontSize: "7rem",
            background: "linear-gradient(135deg, #7c5bad, #c06090)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {receptionNumber}
        </p>
      </motion.div>

      {/* 案内カード */}
      <motion.div
        className="rounded-[1.5rem] p-5 w-full max-w-[480px] relative z-10"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,244,255,0.9))",
          backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(200,180,230,0.25)",
          boxShadow: "0 4px 16px rgba(124,91,173,0.1)",
        }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-xl text-[#4a3560]">
            <span className="text-2xl w-8 text-center">📋</span>
            <span className="font-bold">処方せんをトレイに入れてください</span>
          </div>
          <div className="w-full h-[1px] bg-[#e0d4f0]/50" />
          <div className="flex items-center gap-3 text-xl text-[#4a3560]">
            <span className="text-2xl w-8 text-center">💳</span>
            <span className="font-bold">マイナンバーカードの読み取りをお願いします</span>
          </div>
        </div>
      </motion.div>

      {/* 進捗バー（10秒） */}
      <motion.div
        className="w-full max-w-[460px] h-2 rounded-full bg-[#e0d4f0]/40 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#9b7cc0] to-[#d4699e]"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 10, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
}
