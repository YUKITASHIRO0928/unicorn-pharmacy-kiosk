// キャラクター画像とポーズのマッピング

export type CharacterType = "medicoorn" | "lunabelle";
export type PoseType = "home" | "greeting" | "question" | "pointing" | "surprised" | "walking" | "happy" | "bow";

const medicoornPoses: Record<PoseType, string> = {
  home: "/characters/medicoorn/unicornA.png",
  greeting: "/characters/medicoorn/unicorn_f.png",
  question: "/characters/medicoorn/unicorn_g.png",
  pointing: "/characters/medicoorn/unicorn_f.png",
  surprised: "/characters/medicoorn/unicorn_k.png",
  walking: "/characters/medicoorn/unicorn_h.png",
  happy: "/characters/medicoorn/unicorn_f.png",
  bow: "/characters/medicoorn/unicorn_g.png",
};

const lunabellePoses: Record<PoseType, string> = {
  home: "/characters/lunabelle/pose1.png",
  greeting: "/characters/lunabelle/pose6.png",
  question: "/characters/lunabelle/pose4.png",
  pointing: "/characters/lunabelle/pose5.png",
  surprised: "/characters/lunabelle/pose7.png",
  walking: "/characters/lunabelle/pose3.png",
  happy: "/characters/lunabelle/pose2.png",
  bow: "/characters/lunabelle/pose8.png",
};

export function getCharacterPose(character: CharacterType, pose: PoseType): string {
  if (character === "medicoorn") return medicoornPoses[pose];
  return lunabellePoses[pose];
}

export const characterNames: Record<CharacterType, string> = {
  medicoorn: "メディコーン",
  lunabelle: "ルナベール",
};
