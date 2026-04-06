"use client";

import { useReducer, useCallback, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { CharacterType } from "./lib/characters";
import { preloadVoices, stopSpeaking } from "./lib/speech";
import HomeScreen from "./components/screens/HomeScreen";
import MedicineBookScreen from "./components/screens/MedicineBookScreen";
import GenericDrugScreen from "./components/screens/GenericDrugScreen";
import QuestionnaireScreen from "./components/screens/QuestionnaireScreen";
import CompleteScreen from "./components/screens/CompleteScreen";
import BackgroundEffects from "./components/BackgroundEffects";

// --- State ---
type Screen =
  | "home"
  | "medicineBook"
  | "genericDrug"
  | "questionnaire"
  | "complete";

type PatientType = "first" | "regular" | null;

type State = {
  screen: Screen;
  character: CharacterType;
  patientType: PatientType;
  hasMedicineBook: boolean | null;
  wantsGeneric: boolean | null;
  receptionNumber: number;
};

type Action =
  | { type: "SELECT_PATIENT_TYPE"; payload: PatientType }
  | { type: "SET_MEDICINE_BOOK"; payload: boolean }
  | { type: "SET_GENERIC"; payload: boolean }
  | { type: "QUESTIONNAIRE_DONE" }
  | { type: "GO_TO_COMPLETE" }
  | { type: "RESET" }
  | { type: "TOGGLE_CHARACTER" };

function getReceptionNumber(): number {
  if (typeof window === "undefined") return 1;
  const today = new Date().toDateString();
  const stored = localStorage.getItem("uketuke_date");
  const count = localStorage.getItem("uketuke_count");

  if (stored === today && count) {
    const next = parseInt(count) + 1;
    localStorage.setItem("uketuke_count", String(next));
    return next;
  } else {
    localStorage.setItem("uketuke_date", today);
    localStorage.setItem("uketuke_count", "1");
    return 1;
  }
}

function getSavedCharacter(): CharacterType {
  if (typeof window === "undefined") return "medicoorn";
  return (localStorage.getItem("uketuke_character") as CharacterType) || "medicoorn";
}

const initialState: State = {
  screen: "home",
  character: "medicoorn",
  patientType: null,
  hasMedicineBook: null,
  wantsGeneric: null,
  receptionNumber: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SELECT_PATIENT_TYPE":
      return {
        ...state,
        patientType: action.payload,
        screen: "medicineBook",
      };
    case "SET_MEDICINE_BOOK":
      return {
        ...state,
        hasMedicineBook: action.payload,
        screen: "genericDrug",
      };
    case "SET_GENERIC":
      if (state.patientType === "first") {
        return {
          ...state,
          wantsGeneric: action.payload,
          screen: "questionnaire",
        };
      }
      return {
        ...state,
        wantsGeneric: action.payload,
        screen: "complete",
        receptionNumber: getReceptionNumber(),
      };
    case "QUESTIONNAIRE_DONE":
    case "GO_TO_COMPLETE":
      return {
        ...state,
        screen: "complete",
        receptionNumber:
          state.receptionNumber > 0
            ? state.receptionNumber
            : getReceptionNumber(),
      };
    case "RESET":
      stopSpeaking();
      return {
        ...initialState,
        character: state.character,
      };
    case "TOGGLE_CHARACTER": {
      const next: CharacterType =
        state.character === "medicoorn" ? "lunabelle" : "medicoorn";
      if (typeof window !== "undefined") {
        localStorage.setItem("uketuke_character", next);
      }
      return { ...state, character: next };
    }
    default:
      return state;
  }
}

export default function KioskPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初期化: キャラクター復元 + 音声プリロード
  useEffect(() => {
    const saved = getSavedCharacter();
    if (saved !== state.character) {
      dispatch({ type: "TOGGLE_CHARACTER" });
    }
    preloadVoices();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 無操作タイムアウト（60秒でホームに戻る。完了画面は別途10秒）
  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (state.screen !== "home" && state.screen !== "complete") {
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: "RESET" });
      }, 60000);
    }
  }, [state.screen]);

  useEffect(() => {
    resetTimeout();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state.screen, resetTimeout]);

  // 画面タッチでタイムアウトリセット
  useEffect(() => {
    const handler = () => resetTimeout();
    window.addEventListener("pointerdown", handler);
    return () => window.removeEventListener("pointerdown", handler);
  }, [resetTimeout]);

  const handleComplete = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return (
    <main className="h-full w-full relative overflow-hidden">
      <BackgroundEffects />
      <AnimatePresence mode="wait">
        {state.screen === "home" && (
          <HomeScreen
            key="home"
            character={state.character}
            onSelectFirst={() =>
              dispatch({ type: "SELECT_PATIENT_TYPE", payload: "first" })
            }
            onSelectRegular={() =>
              dispatch({ type: "SELECT_PATIENT_TYPE", payload: "regular" })
            }
            onToggleCharacter={() =>
              dispatch({ type: "TOGGLE_CHARACTER" })
            }
          />
        )}

        {state.screen === "medicineBook" && (
          <MedicineBookScreen
            key="medicineBook"
            character={state.character}
            onHave={() =>
              dispatch({ type: "SET_MEDICINE_BOOK", payload: true })
            }
            onDontHave={() =>
              dispatch({ type: "SET_MEDICINE_BOOK", payload: false })
            }
          />
        )}

        {state.screen === "genericDrug" && (
          <GenericDrugScreen
            key="genericDrug"
            character={state.character}
            onGeneric={() =>
              dispatch({ type: "SET_GENERIC", payload: true })
            }
            onBrand={() =>
              dispatch({ type: "SET_GENERIC", payload: false })
            }
          />
        )}

        {state.screen === "questionnaire" && (
          <QuestionnaireScreen
            key="questionnaire"
            character={state.character}
            onSmartphone={() =>
              dispatch({ type: "QUESTIONNAIRE_DONE" })
            }
            onHandwritten={() =>
              dispatch({ type: "QUESTIONNAIRE_DONE" })
            }
          />
        )}

        {state.screen === "complete" && (
          <CompleteScreen
            key="complete"
            character={state.character}
            receptionNumber={state.receptionNumber}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
