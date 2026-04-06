"use client";

import { motion, AnimatePresence } from "framer-motion";

type SpeechBubbleProps = {
  text: string;
  show: boolean;
};

export default function SpeechBubble({ text, show }: SpeechBubbleProps) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key={text}
          className="relative max-w-[88%] mx-auto"
          initial={{ opacity: 0, y: 15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* 吹き出し本体 */}
          <div
            className="relative rounded-[1.8rem] px-8 py-5 shadow-[0_4px_20px_rgba(139,95,191,0.12)]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,244,255,0.95))",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(200, 180, 230, 0.3)",
            }}
          >
            <p
              className="font-bold text-center leading-relaxed"
              style={{
                fontSize: "clamp(1.2rem, 3vh, 3rem)",
                color: "#5a3d7a",
                fontFeatureSettings: "'palt'",
              }}
            >
              {text}
            </p>
          </div>

          {/* 吹き出しの三角 */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: "14px solid transparent",
                borderRight: "14px solid transparent",
                borderTop: "14px solid rgba(248,244,255,0.95)",
                filter: "drop-shadow(0 2px 3px rgba(139,95,191,0.08))",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
