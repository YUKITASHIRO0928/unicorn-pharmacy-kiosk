"use client";

import { motion } from "framer-motion";

// ========== SVGパーツ ==========

function Cloud({ x, y, scale = 1, opacity = 0.5, duration = 30, delay = 0 }: {
  x: string; y: string; scale?: number; opacity?: number; duration?: number; delay?: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 200 100"
      className="absolute"
      style={{ left: x, top: y, width: `${180 * scale}px` }}
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

function SmallCloud({ x, y, scale = 0.6, opacity = 0.35, duration = 25, delay = 0 }: {
  x: string; y: string; scale?: number; opacity?: number; duration?: number; delay?: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 140 70"
      className="absolute"
      style={{ left: x, top: y, width: `${120 * scale}px` }}
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
      style={{ right: "-10%", top: "-5%", width: "70%", opacity: 0.2 }}
      animate={{ opacity: [0.12, 0.22, 0.12] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      {[
        { r: 250, color: "#ff8888" },
        { r: 235, color: "#ffbb77" },
        { r: 220, color: "#ffee77" },
        { r: 205, color: "#88dd88" },
        { r: 190, color: "#77bbff" },
        { r: 175, color: "#9988ee" },
        { r: 160, color: "#cc88dd" },
      ].map((arc, i) => (
        <path
          key={i}
          d={`M ${300 - arc.r} 280 A ${arc.r} ${arc.r} 0 0 1 ${300 + arc.r} 280`}
          fill="none"
          stroke={arc.color}
          strokeWidth="12"
          strokeLinecap="round"
        />
      ))}
    </motion.svg>
  );
}

function Star({ x, y, size, delay, color }: {
  x: string; y: string; size: number; delay: number; color: string;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="absolute"
      style={{ left: x, top: y, width: `${size}px`, height: `${size}px` }}
      animate={{
        opacity: [0.2, 0.8, 0.2],
        scale: [0.8, 1.15, 0.8],
        rotate: [0, 15, -15, 0],
      }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <path
        d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14 2 9.2h7.6z"
        fill={color}
      />
    </motion.svg>
  );
}

function Heart({ x, y, size, delay, color }: {
  x: string; y: string; size: number; delay: number; color: string;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="absolute"
      style={{ left: x, top: y, width: `${size}px`, height: `${size}px` }}
      animate={{
        opacity: [0.15, 0.55, 0.15],
        y: [0, -15, 0],
        scale: [0.9, 1.1, 0.9],
      }}
      transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color}
      />
    </motion.svg>
  );
}

function Sparkle({ x, y, size, delay }: {
  x: string; y: string; size: number; delay: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="absolute"
      style={{ left: x, top: y, width: `${size}px`, height: `${size}px` }}
      animate={{
        opacity: [0, 0.7, 0],
        scale: [0.5, 1.2, 0.5],
        rotate: [0, 180, 360],
      }}
      transition={{ duration: 2.5 + Math.random() * 2, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <path
        d="M12 0 L13.5 9 L24 12 L13.5 15 L12 24 L10.5 15 L0 12 L10.5 9 Z"
        fill="rgba(220, 200, 255, 0.5)"
      />
    </motion.svg>
  );
}

function MusicNote({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="absolute"
      style={{ left: x, top: y, width: "22px", height: "22px" }}
      animate={{
        opacity: [0, 0.45, 0],
        y: [0, -30, -60],
        x: [0, 10, 5],
        rotate: [0, -15, 10],
      }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: "easeOut" }}
    >
      <path
        d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
        fill="rgba(180, 150, 220, 0.45)"
      />
    </motion.svg>
  );
}

// ========== メインコンポーネント ==========

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* グラデーション背景オーブ */}
      <div className="bg-pattern" />

      {/* 虹 */}
      <Rainbow />

      {/* 大きな雲 */}
      <Cloud x="-5%" y="5%" scale={1.1} opacity={0.45} duration={35} delay={0} />
      <Cloud x="55%" y="2%" scale={0.9} opacity={0.35} duration={30} delay={5} />
      <Cloud x="20%" y="75%" scale={0.8} opacity={0.3} duration={28} delay={8} />

      {/* 小さな雲 */}
      <SmallCloud x="5%" y="35%" scale={0.7} opacity={0.3} duration={22} delay={3} />
      <SmallCloud x="70%" y="45%" scale={0.55} opacity={0.25} duration={26} delay={10} />
      <SmallCloud x="40%" y="88%" scale={0.6} opacity={0.28} duration={20} delay={6} />

      {/* 星 */}
      <Star x="8%" y="15%" size={20} delay={0} color="rgba(230, 210, 140, 0.5)" />
      <Star x="88%" y="12%" size={16} delay={1.5} color="rgba(200, 180, 240, 0.45)" />
      <Star x="75%" y="60%" size={18} delay={0.8} color="rgba(230, 210, 140, 0.4)" />
      <Star x="15%" y="55%" size={14} delay={2.2} color="rgba(240, 190, 210, 0.45)" />
      <Star x="50%" y="25%" size={12} delay={3} color="rgba(200, 220, 240, 0.4)" />
      <Star x="92%" y="80%" size={15} delay={1} color="rgba(230, 200, 160, 0.4)" />

      {/* ハート */}
      <Heart x="12%" y="28%" size={18} delay={1} color="rgba(230, 160, 190, 0.35)" />
      <Heart x="82%" y="35%" size={14} delay={2.5} color="rgba(220, 150, 200, 0.3)" />
      <Heart x="45%" y="70%" size={16} delay={0.5} color="rgba(240, 170, 190, 0.3)" />
      <Heart x="65%" y="15%" size={12} delay={3.5} color="rgba(210, 160, 210, 0.3)" />

      {/* キラキラ */}
      <Sparkle x="20%" y="10%" size={22} delay={0.5} />
      <Sparkle x="78%" y="25%" size={18} delay={2} />
      <Sparkle x="35%" y="50%" size={16} delay={3.5} />
      <Sparkle x="60%" y="82%" size={20} delay={1.2} />
      <Sparkle x="90%" y="55%" size={14} delay={4} />
      <Sparkle x="5%" y="75%" size={17} delay={2.8} />

      {/* 音符 */}
      <MusicNote x="18%" y="42%" delay={0} />
      <MusicNote x="72%" y="68%" delay={3} />
      <MusicNote x="85%" y="20%" delay={6} />

      {/* ソフトな光の玉 */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(200,170,240,0.13) 0%, transparent 65%)",
          left: "5%",
          top: "10%",
        }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(240,180,200,0.1) 0%, transparent 65%)",
          right: "0%",
          bottom: "15%",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(170,210,240,0.1) 0%, transparent 65%)",
          left: "40%",
          top: "50%",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
}
