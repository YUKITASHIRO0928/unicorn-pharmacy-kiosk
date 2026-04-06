"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CharacterType, PoseType, getCharacterPose } from "../lib/characters";

type UnicornCharacterProps = {
  character: CharacterType;
  pose: PoseType;
  floating?: boolean;
  /** vh単位でサイズ指定（画面高さに対する割合） */
  sizeVh?: number;
};

export default function UnicornCharacter({
  character,
  pose,
  floating = true,
  sizeVh = 30,
}: UnicornCharacterProps) {
  const imageSrc = getCharacterPose(character, pose);

  return (
    <div className={floating ? "animate-float" : ""}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${character}-${pose}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          style={{ width: `${sizeVh}vh`, height: `${sizeVh}vh` }}
          className="relative"
        >
          <Image
            src={imageSrc}
            alt={character}
            fill
            className="drop-shadow-lg object-contain"
            priority
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
