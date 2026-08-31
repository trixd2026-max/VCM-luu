import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SheetConfig = {
  sheetId: string;
  csvUrl: string;
  gid: string;
  sheetName: string;
  webhookUrl: string;
};

const empty: SheetConfig = {
  sheetId: "1PIwNQOmYupdqww3_Y5i1a4sPYpmHs2LNZlWIUlPsb5U",
  // Không dùng URL /edit — chỉ sheetId + sheetName (hoặc CSV export thật)
  csvUrl: "",
  gid: "1069887904",
  sheetName: "san-pham-vuon-cua-mit",
  webhookUrl:
    "https://script.google.com/macros/s/AKfycbxzJYDAYzCcZQ1q-RPymdDVBY0NLUIWiq3SjoziSkTX2T1mJjibv3AiCeUv0IO9HKSyVg/exec",
};

type State = SheetConfig & {
  setConfig: (patch: Partial<SheetConfig>) => void;
  connected: () => boolean;
};

export const useSheetConfig = create<State>()(
  persist(
    (set, get) => ({
      ...empty,
      setConfig: (patch) => set(patch),
      connected: () => Boolean(get().sheetId.trim() || get().csvUrl.trim()),
    }),
    { name: "vcm-sheet" },
  ),
);
