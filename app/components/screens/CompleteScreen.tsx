"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import UnicornCharacter from "../UnicornCharacter";
import SpeechBubble from "../SpeechBubble";
import { CharacterType } from "../../lib/characters";
import { speak, stopSpeaking } from "../../lib/speech";

type CompleteScreenProps = {
  character: CharacterType;
  receptionNumber: number;
  hasMedicineBook: boolean;
  onComplete: () => void;
};

const TRANSITION_SECONDS = 15;

export default function CompleteScreen({
  character,
  receptionNumber,
  hasMedicineBook,
  onComplete,
}: CompleteScreenProps) {
  const trayText = hasMedicineBook
    ? "処方せんとおくすり手帳をトレイに入れてください"
    : "処方せんをトレイに入れてください";

  // 音声テキスト（短くシンプルに）
  const speechText = hasMedicineBook
    ? `ばんごうふだ${receptionNumber}番をお取りください。処方せんとおくすり手帳をトレイに入れて、マイナンバーの読み取りをお願いします`
    : `ばんごうふだ${receptionNumber}番をお取りください。処方せんをトレイに入れて、マイナンバーの読み取りをお願いします`;

  const characterRef = useRef(character);
  const onCompleteRef = useRef(onComplete);
  const speechTextRef = useRef(speechText);
  characterRef.current = character;
  onCompleteRef.current = onComplete;
  speechTextRef.current = speechText;

  useEffect(() => {
    // 画面遷移アニメーション完了を確実に待つ
    const timer = setTimeout(() => {
      speak(speechTextRef.current, characterRef.current);
    }, 1000);

    const resetTimer = setTimeout(() => {
      onCompleteRef.current();
    }, TRANSITION_SECONDS * 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(resetTimer);
      stopSpeaking();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sparkles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      emoji: ["✨", "⭐", "💫", "🌟"][i % 4],
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      delay: i * 0.4,
    }));
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-between h-full px-[5vw] relative z-10"
      style={{ paddingTop: "3vh", paddingBottom: "3vh" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: "clamp(16px, 2.5vh, 28px)",
            zIndex: 5,
            animation: "sparkle 2.5s ease-in-out infinite",
            animationDelay: `${s.delay}s`,
            willChange: "opacity, transform",
          }}
        >
          {s.emoji}
        </div>
      ))}

      <SpeechBubble text="ありがとうございます！" show />

      <UnicornCharacter character={character} pose="happy" sizeVh={20} floating />

      <motion.div
        className="rounded-[2rem] text-center relative z-10 shrink-0"
        style={{
          padding: "2vh 6vw",
          background: "linear-gradient(135deg, rgba(255,255,255,0.97), rgba(248,244,255,0.97))",
          boxShadow: "0 8px 32px rgba(124,91,173,0.18), 0 0 0 2px rgba(200,180,230,0.2)",
        }}
        initial={{ scale: 0, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 180 }}
      >
        <p
          className="text-[#9b7cc0] font-bold tracking-wide"
          style={{ fontSize: "clamp(1rem, 2vh, 2rem)", marginBottom: "0.5vh" }}
        >
          🎫 番号札をお取りください
        </p>
        <p
          className="font-black leading-none"
          style={{
            fontSize: "clamp(3rem, 8vh, 8rem)",
            background: "linear-gradient(135deg, #7c5bad, #c06090)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {receptionNumber}
        </p>
      </motion.div>

      <motion.div
        className="rounded-[1.5rem] w-full relative z-10 shrink-0"
        style={{
          padding: "2vh 4vw",
          maxWidth: "90vw",
          background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,244,255,0.9))",
          backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(200,180,230,0.25)",
          boxShadow: "0 4px 16px rgba(124,91,173,0.1)",
        }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col" style={{ gap: "1.2vh" }}>
          <div className="flex items-center gap-3" style={{ fontSize: "clamp(0.9rem, 2vh, 2rem)" }}>
            <span className="shrink-0" style={{ fontSize: "1.2em" }}>📋</span>
            <span className="font-bold text-[#4a3560]">{trayText}</span>
          </div>
          <div className="w-full h-[1px] bg-[#e0d4f0]/50" />
          <div className="flex items-center gap-3" style={{ fontSize: "clamp(0.9rem, 2vh, 2rem)" }}>
            <span className="shrink-0" style={{ fontSize: "1.2em" }}>💳</span>
            <span className="font-bold text-[#4a3560]">マイナンバーカードの読み取りをお願いします</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="w-full rounded-full bg-[#e0d4f0]/40 overflow-hidden shrink-0"
        style={{ maxWidth: "85vw", height: "0.8vh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#9b7cc0] to-[#d4699e]"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: TRANSITION_SECONDS, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
}
