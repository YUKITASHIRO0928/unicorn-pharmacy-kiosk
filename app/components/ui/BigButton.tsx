"use client";

import { motion } from "framer-motion";

type BigButtonProps = {
  label: string;
  onClick: () => void;
  color?: "primary" | "secondary" | "positive" | "warning" | "gray";
  size?: "normal" | "large";
  icon?: string;
};

const colorMap = {
  primary:
    "bg-gradient-to-br from-[#8e6bbf] to-[#6a4a9e] hover:from-[#7d5db0] hover:to-[#5d4090] active:from-[#6c4f9e] active:to-[#503882] text-white shadow-[0_6px_20px_rgba(124,91,173,0.35)]",
  secondary:
    "bg-gradient-to-br from-[#e07aab] to-[#c45588] hover:from-[#d46c9e] hover:to-[#b84c7c] active:from-[#c55e90] active:to-[#a8426e] text-white shadow-[0_6px_20px_rgba(212,105,158,0.35)]",
  positive:
    "bg-gradient-to-br from-[#6ab87f] to-[#4a8e5e] hover:from-[#5eaa72] hover:to-[#408052] active:from-[#529c66] active:to-[#367246] text-white shadow-[0_6px_20px_rgba(90,158,111,0.35)]",
  warning:
    "bg-gradient-to-br from-[#d98e50] to-[#b86a2c] hover:from-[#cd8245] hover:to-[#a85e24] active:from-[#c1763a] active:to-[#98521c] text-white shadow-[0_6px_20px_rgba(201,122,58,0.35)]",
  gray:
    "bg-gradient-to-br from-[#9898a8] to-[#747488] hover:from-[#8c8c9c] hover:to-[#68687c] active:from-[#808090] active:to-[#5c5c70] text-white shadow-[0_6px_20px_rgba(138,138,154,0.3)]",
};

export default function BigButton({
  label,
  onClick,
  color = "primary",
  size = "normal",
  icon,
}: BigButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        ${colorMap[color]}
        rounded-[1.5rem] font-bold
        w-full
        transition-all duration-200
        border-b-[3px] border-white/10
        btn-shimmer
        relative z-10
        tracking-wide
        leading-snug
      `}
      style={{
        padding: size === "large" ? "2.5vh 4vw" : "2vh 3vw",
        fontSize: size === "large" ? "clamp(1.5rem, 3.5vh, 3.5rem)" : "clamp(1.2rem, 2.8vh, 2.8rem)",
      }}
      whileTap={{ scale: 0.96, y: 2 }}
      whileHover={{ scale: 1.02, y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-3">
        {icon && <span className="text-[1.3em]">{icon}</span>}
        {label}
      </span>
    </motion.button>
  );
}
