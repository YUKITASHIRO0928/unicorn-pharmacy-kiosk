"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import UnicornCharacter from "../UnicornCharacter";
import SpeechBubble from "../SpeechBubble";
import BigButton from "../ui/BigButton";
import { CharacterType } from "../../lib/characters";
import { speak, stopSpeaking } from "../../lib/speech";

type MedicineBookScreenProps = {
  character: CharacterType;
  onHave: () => void;
  onDontHave: () => void;
};

export default function MedicineBookScreen({
  character,
  onHave,
  onDontHave,
}: MedicineBookScreenProps) {
  useEffect(() => {
    speak("おくすり手帳はお持ちですか？", character);
    return () => stopSpeaking();
  }, [character]);

  return (
    <motion.div
      className="flex flex-col items-center h-full px-[4vw] relative z-10"
      style={{ paddingTop: "3vh", paddingBottom: "3vh", gap: "2vh" }}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <div className="flex gap-3 items-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`rounded-full ${
              i === 0
                ? "bg-gradient-to-br from-[#9b7cc0] to-[#7c5bad] shadow-[0_0_8px_rgba(124,91,173,0.4)]"
                : "bg-[#d9cee8]/60"
            }`}
            style={{ width: i === 0 ? "2vh" : "1.5vh", height: i === 0 ? "2vh" : "1.5vh" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>

      <SpeechBubble text="おくすり手帳はお持ちですか？" show />

      <div className="flex-1 flex items-center justify-center min-h-0">
        <UnicornCharacter character={character} pose="question" sizeVh={30} />
      </div>

      <div className="flex flex-col w-full" style={{ gap: "2vh", maxWidth: "80vw" }}>
        <BigButton label="持っている" onClick={onHave} color="positive" size="large" icon="📒" />
        <BigButton label="持っていない" onClick={onDontHave} color="gray" size="large" icon="✕" />
      </div>
    </motion.div>
  );
}
