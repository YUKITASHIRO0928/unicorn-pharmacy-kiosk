"use client";

import { motion } from "framer-motion";

// ========== SVGパーツ（すべてvw/vh単位で大画面対応） ==========

function Cloud({ x, y, widthVw = 25, opacity = 0.5, duration = 30, delay = 0 }: {
  x: string; y: string; widthVw?: number; opacity?: number; duration?: number; delay?: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 200 100"
      className="absolute"
      style={{ left: x, top: y, width: `${widthVw}vw` }}
      animate={{ x: [0, 40, 0], y: [0, -8, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <g opacity={opacity}>
        <ellipse cx="60" cy="65" rx="55" ry="30" fill="white" />
        <ellipse cx="100" cy="50" rx="50" ry="35" fill="white" />
        <ellipse cx="140" cy="60" rx="45" ry="28" fill="white" />
        <ellipse cx="80" cy="45" rx="35" ry="28" fill="white" />
        <ellipse cx="120" cy="42" rx="30" ry="25" fill="white" />
      </g>
    </motion.svg>
  );
}

function SmallCloud({ x, y, widthVw = 16, opacity = 0.4, duration = 25, delay = 0 }: {
  x: string; y: string; widthVw?: number; opacity?: number; duration?: number; delay?: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 140 70"
      className="absolute"
      style={{ left: x, top: y, width: `${widthVw}vw` }}
      animate={{ x: [0, 25, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <g opacity={opacity}>
        <ellipse cx="45" cy="42" rx="38" ry="22" fill="white" />
        <ellipse cx="75" cy="35" rx="35" ry="25" fill="white" />
        <ellipse cx="100" cy="42" rx="30" ry="20" fill="white" />
      </g>
    </motion.svg>
  );
}

function Rainbow() {
  return (
    <motion.svg
      viewBox="0 0 600 300"
      className="absolute"
      style={{ right: "-15%", top: "-8%", width: "90vw" }}
      animate={{ opacity: [0.18, 0.3, 0.18] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      {[
        { r: 260, color: "#ff8888" },
        { r: 243, color: "#ffbb77" },
        { r: 226, color: "#ffee77" },
        { r: 209, color: "#88dd88" },
        { r: 192, color: "#77bbff" },
        { r: 175, color: "#9988ee" },
        { r: 158, color: "#cc88dd" },
      ].map((arc, i) => (
        <path
          key={i}
          d={`M ${300 - arc.r} 280 A ${arc.r} ${arc.r} 0 0 1 ${300 + arc.r} 280`}
          fill="none"
          stroke={arc.color}
          strokeWidth="14"
          strokeLinecap="round"
        />
      ))}
    </motion.svg>
  );
}

function Star({ x, y, sizeVw, delay, color }: {
  x: string; y: string; sizeVw: number; delay: number; color: string;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="absolute"
      style={{ left: x, top: y, width: `${sizeVw}vw`, height: `${sizeVw}vw` }}
      animate={{
        opacity: [0.25, 0.85, 0.25],
        scale: [0.8, 1.15, 0.8],
        rotate: [0, 15, -15, 0],
      }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14 2 9.2h7.6z" fill={color} />
    </motion.svg>
  );
}

function Heart({ x, y, sizeVw, delay, color }: {
  x: string; y: string; sizeVw: number; delay: number; color: string;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="absolute"
      style={{ left: x, top: y, width: `${sizeVw}vw`, height: `${sizeVw}vw` }}
      animate={{
        opacity: [0.2, 0.6, 0.2],
        y: [0, -15, 0],
        scale: [0.9, 1.1, 0.9],
      }}
      transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={color} />
    </motion.svg>
  );
}

function Sparkle({ x, y, sizeVw, delay }: {
  x: string; y: string; sizeVw: number; delay: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="absolute"
      style={{ left: x, top: y, width: `${sizeVw}vw`, height: `${sizeVw}vw` }}
      animate={{
        opacity: [0, 0.75, 0],
        scale: [0.5, 1.2, 0.5],
        rotate: [0, 180, 360],
      }}
      transition={{ duration: 2.5 + Math.random() * 2, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <path d="M12 0 L13.5 9 L24 12 L13.5 15 L12 24 L10.5 15 L0 12 L10.5 9 Z" fill="rgba(220, 200, 255, 0.55)" />
    </motion.svg>
  );
}

function MusicNote({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="absolute"
      style={{ left: x, top: y, width: "4vw", height: "4vw" }}
      animate={{
        opacity: [0, 0.5, 0],
        y: [0, -40, -80],
        x: [0, 15, 8],
        rotate: [0, -15, 10],
      }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: "easeOut" }}
    >
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="rgba(180, 150, 220, 0.5)" />
    </motion.svg>
  );
}

// ========== メインコンポーネント ==========

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="bg-pattern" />

      {/* 虹 - 大きく */}
      <Rainbow />

      {/* 大きな雲 */}
      <Cloud x="-8%" y="3%" widthVw={35} opacity={0.5} duration={35} delay={0} />
      <Cloud x="50%" y="1%" widthVw={30} opacity={0.4} duration={30} delay={5} />
      <Cloud x="15%" y="70%" widthVw={28} opacity={0.35} duration={28} delay={8} />
      <Cloud x="60%" y="80%" widthVw={25} opacity={0.3} duration={32} delay={12} />

      {/* 小さな雲 */}
      <SmallCloud x="0%" y="30%" widthVw={20} opacity={0.4} duration={22} delay={3} />
      <SmallCloud x="65%" y="40%" widthVw={18} opacity={0.35} duration={26} delay={10} />
      <SmallCloud x="35%" y="55%" widthVw={15} opacity={0.3} duration={20} delay={6} />
      <SmallCloud x="80%" y="65%" widthVw={17} opacity={0.3} duration={24} delay={15} />
      <SmallCloud x="10%" y="90%" widthVw={16} opacity={0.35} duration={21} delay={2} />

      {/* 星 */}
      <Star x="6%" y="12%" sizeVw={5} delay={0} color="rgba(230, 210, 140, 0.55)" />
      <Star x="88%" y="10%" sizeVw={4} delay={1.5} color="rgba(200, 180, 240, 0.5)" />
      <Star x="75%" y="55%" sizeVw={4.5} delay={0.8} color="rgba(230, 210, 140, 0.45)" />
      <Star x="12%" y="50%" sizeVw={3.5} delay={2.2} color="rgba(240, 190, 210, 0.5)" />
      <Star x="50%" y="20%" sizeVw={3} delay={3} color="rgba(200, 220, 240, 0.45)" />
      <Star x="92%" y="78%" sizeVw={4} delay={1} color="rgba(230, 200, 160, 0.45)" />
      <Star x="30%" y="85%" sizeVw={3.5} delay={4} color="rgba(220, 190, 240, 0.4)" />

      {/* ハート */}
      <Heart x="10%" y="25%" sizeVw={5} delay={1} color="rgba(230, 160, 190, 0.4)" />
      <Heart x="82%" y="32%" sizeVw={4} delay={2.5} color="rgba(220, 150, 200, 0.35)" />
      <Heart x="42%" y="65%" sizeVw={4.5} delay={0.5} color="rgba(240, 170, 190, 0.35)" />
      <Heart x="68%" y="12%" sizeVw={3.5} delay={3.5} color="rgba(210, 160, 210, 0.35)" />
      <Heart x="25%" y="42%" sizeVw={3} delay={4.5} color="rgba(230, 170, 200, 0.3)" />

      {/* キラキラ */}
      <Sparkle x="18%" y="8%" sizeVw={5} delay={0.5} />
      <Sparkle x="78%" y="22%" sizeVw={4.5} delay={2} />
      <Sparkle x="32%" y="48%" sizeVw={4} delay={3.5} />
      <Sparkle x="58%" y="78%" sizeVw={5} delay={1.2} />
      <Sparkle x="90%" y="50%" sizeVw={3.5} delay={4} />
      <Sparkle x="4%" y="72%" sizeVw={4} delay={2.8} />
      <Sparkle x="48%" y="35%" sizeVw={3} delay={5} />

      {/* 音符 */}
      <MusicNote x="15%" y="38%" delay={0} />
      <MusicNote x="70%" y="62%" delay={3} />
      <MusicNote x="85%" y="18%" delay={6} />
      <MusicNote x="40%" y="82%" delay={9} />

      {/* ソフトな光の玉 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "40vw", height: "40vw",
          background: "radial-gradient(circle, rgba(200,170,240,0.15) 0%, transparent 65%)",
          left: "0%", top: "8%",
        }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "35vw", height: "35vw",
          background: "radial-gradient(circle, rgba(240,180,200,0.12) 0%, transparent 65%)",
          right: "-5%", bottom: "10%",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "30vw", height: "30vw",
          background: "radial-gradient(circle, rgba(170,210,240,0.12) 0%, transparent 65%)",
          left: "35%", top: "45%",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
}
