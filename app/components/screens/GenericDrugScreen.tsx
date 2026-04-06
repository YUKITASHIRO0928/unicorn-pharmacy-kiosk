"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UnicornCharacter from "../UnicornCharacter";
import SpeechBubble from "../SpeechBubble";
import BigButton from "../ui/BigButton";
import Popup from "../ui/Popup";
import { CharacterType } from "../../lib/characters";
import { speak, stopSpeaking } from "../../lib/speech";

type GenericDrugScreenProps = {
  character: CharacterType;
  onGeneric: () => void;
  onBrand: () => void;
};

export default function GenericDrugScreen({
  character,
  onGeneric,
  onBrand,
}: GenericDrugScreenProps) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    speak("ジェネリックいやくひんのご準備でよろしいでしょうか？", character);
    return () => stopSpeaking();
  }, [character]);

  const handleBrandClick = () => {
    setShowPopup(true);
    speak("せんぱつひんを選択された場合、せんていりょうようひとして追加の費用がかかります", character);
  };

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
              i <= 1
                ? "bg-gradient-to-br from-[#9b7cc0] to-[#7c5bad] shadow-[0_0_8px_rgba(124,91,173,0.4)]"
                : "bg-[#d9cee8]/60"
            }`}
            style={{ width: i <= 1 ? "2vh" : "1.5vh", height: i <= 1 ? "2vh" : "1.5vh" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>

      <SpeechBubble text="ジェネリック医薬品のご準備でよろしいでしょうか？" show={!showPopup} />

      <div className="flex-1 flex items-center justify-center min-h-0">
        <UnicornCharacter character={character} pose={showPopup ? "surprised" : "pointing"} sizeVh={30} />
      </div>

      <div className="flex flex-col w-full" style={{ gap: "2vh", maxWidth: "80vw" }}>
        <BigButton label="はい、ジェネリックで" onClick={onGeneric} color="positive" size="large" icon="💊" />
        <BigButton label="先発品がいいです" onClick={handleBrandClick} color="warning" size="large" icon="💎" />
      </div>

      <Popup
        show={showPopup}
        title="選定療養費について"
        message="先発品を選択された場合、選定療養費として追加の費用がかかります。よろしいですか？"
      >
        <BigButton label="了承する" onClick={() => { setShowPopup(false); onBrand(); }} color="warning" icon="✓" />
        <BigButton label="やっぱりジェネリックにする" onClick={() => { setShowPopup(false); onGeneric(); }} color="positive" icon="💊" />
      </Popup>
    </motion.div>
  );
}
