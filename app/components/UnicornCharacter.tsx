"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CharacterType, PoseType, getCharacterPose } from "../lib/characters";

type UnicornCharacterProps = {
  character: CharacterType;
  pose: PoseType;
  floating?: boolean;
  size?: number;
};

export default function UnicornCharacter({
  character,
  pose,
  floating = true,
  size = 320,
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
        >
          <Image
            src={imageSrc}
            alt={character}
            width={size}
            height={size}
            className="drop-shadow-lg"
            style={{ objectFit: "contain" }}
            priority
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
