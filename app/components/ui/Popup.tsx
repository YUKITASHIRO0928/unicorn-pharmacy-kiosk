"use client";

import { motion, AnimatePresence } from "framer-motion";

type PopupProps = {
  show: boolean;
  title: string;
  message: string;
  children: React.ReactNode;
};

export default function Popup({ show, title, message, children }: PopupProps) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(60, 40, 80, 0.45)",
              backdropFilter: "blur(6px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ padding: "4vw" }}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div
              className="rounded-[2rem] w-full"
              style={{
                padding: "3vh 5vw",
                maxWidth: "90vw",
                background: "linear-gradient(145deg, #ffffff, #f8f4ff)",
                boxShadow:
                  "0 20px 60px rgba(80, 50, 120, 0.2), 0 0 0 1px rgba(200, 180, 230, 0.2)",
              }}
            >
              <div className="text-center mb-2" style={{ fontSize: "clamp(2rem, 4vh, 4rem)" }}>⚠️</div>
              <h2
                className="font-black text-center text-[#7c5bad]"
                style={{ fontSize: "clamp(1.3rem, 3vh, 3rem)", marginBottom: "1.5vh" }}
              >
                {title}
              </h2>
              <p
                className="text-center text-[#5a4070] leading-relaxed font-medium"
                style={{ fontSize: "clamp(1rem, 2.2vh, 2.2rem)", marginBottom: "3vh" }}
              >
                {message}
              </p>
              <div className="flex flex-col items-center" style={{ gap: "1.5vh" }}>
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
