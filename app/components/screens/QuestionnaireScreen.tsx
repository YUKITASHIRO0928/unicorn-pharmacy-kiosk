"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import UnicornCharacter from "../UnicornCharacter";
import SpeechBubble from "../SpeechBubble";
import BigButton from "../ui/BigButton";
import { CharacterType } from "../../lib/characters";
import { speak, stopSpeaking } from "../../lib/speech";

type QuestionnaireScreenProps = {
  character: CharacterType;
  onSmartphone: () => void;
  onHandwritten: () => void;
};

const QUESTIONNAIRE_URL = "https://example.com/questionnaire";

export default function QuestionnaireScreen({
  character,
  onSmartphone,
  onHandwritten,
}: QuestionnaireScreenProps) {
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    speak("アンケートのご記入をお願いします", character);
    return () => stopSpeaking();
  }, [character]);

  const handleSmartphone = () => {
    setShowQR(true);
    speak("QRコードをスマートフォンで読み取ってください", character);
  };

  const handleHandwritten = async () => {
    await speak("用紙をお渡ししますので、お席でお待ちください", character);
    onHandwritten();
  };

  if (showQR) {
    return (
      <motion.div
        className="flex flex-col items-center justify-between h-full px-[5vw] relative z-10"
        style={{ paddingTop: "4vh", paddingBottom: "4vh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SpeechBubble text="QRコードを読み取ってね！" show />
        <UnicornCharacter character={character} pose="happy" sizeVh={16} />
        <motion.div
          className="rounded-[1.5rem] shadow-[0_4px_24px_rgba(139,95,191,0.15)]"
          style={{
            padding: "3vh",
            background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,244,255,0.98))",
            border: "2px solid rgba(200, 180, 230, 0.25)",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <QRCodeSVG value={QUESTIONNAIRE_URL} size={250} />
        </motion.div>
        <p
          className="text-[#7c5bad] text-center font-medium leading-relaxed"
          style={{ fontSize: "clamp(1rem, 2vh, 2rem)" }}
        >
          スマートフォンのカメラで<br />QRコードを読み取ってください
        </p>
        <div className="w-full shrink-0" style={{ maxWidth: "85vw" }}>
          <BigButton label="読み取りました" onClick={onSmartphone} color="positive" size="large" icon="✓" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-between h-full px-[5vw] relative z-10"
      style={{ paddingTop: "4vh", paddingBottom: "4vh" }}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <div />
      <SpeechBubble text="アンケートのご記入をお願いします" show />
      <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden" style={{ padding: "1vh 0" }}>
        <UnicornCharacter character={character} pose="walking" sizeVh={28} />
      </div>
      <div className="flex flex-col w-full shrink-0" style={{ gap: "1.5vh", maxWidth: "85vw" }}>
        <BigButton label="スマホで入力する" onClick={handleSmartphone} color="primary" size="large" icon="📱" />
        <BigButton label="手書きで記入する" onClick={handleHandwritten} color="secondary" size="large" icon="✏️" />
      </div>
    </motion.div>
  );
}
