"use client";

// パフォーマンス最適化: framer-motionではなくCSSアニメーションを使用
// GPUアクセラレーションのためtransform3dを使用

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="bg-pattern" />

      {/* 虹 - CSS only */}
      <svg
        viewBox="0 0 600 300"
        className="absolute animate-rainbow-pulse"
        style={{ right: "-15%", top: "-8%", width: "90vw", willChange: "opacity", transform: "translateZ(0)" }}
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
            opacity="0.25"
          />
        ))}
      </svg>

      {/* 雲 - CSS animation */}
      <Cloud x="-5%" y="2%" w="32vw" opacity={0.5} dur="40s" delay="0s" />
      <Cloud x="52%" y="0%" w="26vw" opacity={0.4} dur="35s" delay="-10s" />
      <Cloud x="18%" y="68%" w="24vw" opacity={0.35} dur="32s" delay="-18s" />
      <SmallCloud x="2%" y="28%" w="18vw" opacity={0.38} dur="28s" delay="-5s" />
      <SmallCloud x="68%" y="42%" w="15vw" opacity={0.32} dur="25s" delay="-12s" />
      <SmallCloud x="38%" y="85%" w="14vw" opacity={0.3} dur="22s" delay="-8s" />

      {/* 星 - CSS only */}
      <Star x="8%" y="10%" size="4.5vw" color="rgba(230,210,140,0.5)" delay="0s" />
      <Star x="85%" y="8%" size="3.5vw" color="rgba(200,180,240,0.45)" delay="-1.5s" />
      <Star x="72%" y="52%" size="4vw" color="rgba(230,210,140,0.4)" delay="-3s" />
      <Star x="14%" y="48%" size="3vw" color="rgba(240,190,210,0.45)" delay="-2s" />

      {/* ハート */}
      <Heart x="10%" y="22%" size="4.5vw" color="rgba(230,160,190,0.35)" delay="0s" />
      <Heart x="80%" y="30%" size="3.5vw" color="rgba(220,150,200,0.3)" delay="-2s" />
      <Heart x="44%" y="62%" size="4vw" color="rgba(240,170,190,0.3)" delay="-4s" />

      {/* キラキラ */}
      <Sparkle x="20%" y="8%" size="4.5vw" delay="0s" />
      <Sparkle x="76%" y="20%" size="4vw" delay="-1.5s" />
      <Sparkle x="55%" y="75%" size="4.5vw" delay="-3s" />
      <Sparkle x="88%" y="50%" size="3.5vw" delay="-4.5s" />

      {/* 光の玉 - 静的、アニメなし */}
      <div
        className="absolute rounded-full"
        style={{
          width: "40vw", height: "40vw",
          background: "radial-gradient(circle, rgba(200,170,240,0.12) 0%, transparent 65%)",
          left: "0%", top: "8%",
          transform: "translateZ(0)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: "35vw", height: "35vw",
          background: "radial-gradient(circle, rgba(240,180,200,0.1) 0%, transparent 65%)",
          right: "-5%", bottom: "10%",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}

// ========== CSSアニメーション版コンポーネント ==========

function Cloud({ x, y, w, opacity, dur, delay }: {
  x: string; y: string; w: string; opacity: number; dur: string; delay: string;
}) {
  return (
    <svg
      viewBox="0 0 200 100"
      className="absolute"
      style={{
        left: x, top: y, width: w,
        animation: `cloud-drift ${dur} ease-in-out infinite`,
        animationDelay: delay,
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <g opacity={opacity}>
        <ellipse cx="60" cy="65" rx="55" ry="30" fill="white" />
        <ellipse cx="100" cy="50" rx="50" ry="35" fill="white" />
        <ellipse cx="140" cy="60" rx="45" ry="28" fill="white" />
        <ellipse cx="80" cy="45" rx="35" ry="28" fill="white" />
        <ellipse cx="120" cy="42" rx="30" ry="25" fill="white" />
      </g>
    </svg>
  );
}

function SmallCloud({ x, y, w, opacity, dur, delay }: {
  x: string; y: string; w: string; opacity: number; dur: string; delay: string;
}) {
  return (
    <svg
      viewBox="0 0 140 70"
      className="absolute"
      style={{
        left: x, top: y, width: w,
        animation: `cloud-drift ${dur} ease-in-out infinite`,
        animationDelay: delay,
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <g opacity={opacity}>
        <ellipse cx="45" cy="42" rx="38" ry="22" fill="white" />
        <ellipse cx="75" cy="35" rx="35" ry="25" fill="white" />
        <ellipse cx="100" cy="42" rx="30" ry="20" fill="white" />
      </g>
    </svg>
  );
}

function Star({ x, y, size, color, delay }: {
  x: string; y: string; size: string; color: string; delay: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="absolute"
      style={{
        left: x, top: y, width: size, height: size,
        animation: "twinkle 4s ease-in-out infinite",
        animationDelay: delay,
        willChange: "opacity, transform",
        transform: "translateZ(0)",
      }}
    >
      <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14 2 9.2h7.6z" fill={color} />
    </svg>
  );
}

function Heart({ x, y, size, color, delay }: {
  x: string; y: string; size: string; color: string; delay: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="absolute"
      style={{
        left: x, top: y, width: size, height: size,
        animation: "heart-float 5s ease-in-out infinite",
        animationDelay: delay,
        willChange: "opacity, transform",
        transform: "translateZ(0)",
      }}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={color} />
    </svg>
  );
}

function Sparkle({ x, y, size, delay }: {
  x: string; y: string; size: string; delay: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="absolute"
      style={{
        left: x, top: y, width: size, height: size,
        animation: "sparkle 3.5s ease-in-out infinite",
        animationDelay: delay,
        willChange: "opacity, transform",
        transform: "translateZ(0)",
      }}
    >
      <path d="M12 0 L13.5 9 L24 12 L13.5 15 L12 24 L10.5 15 L0 12 L10.5 9 Z" fill="rgba(220,200,255,0.5)" />
    </svg>
  );
}
