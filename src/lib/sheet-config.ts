import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SheetConfig = {
  sheetId: string;
  csvUrl: string;
  gid: string;
  sheetName: string;
  webhookUrl: string;
  /** Tab đơn hàng trên cùng Sheet */
  ordersSheetName: string;
};

/**
 * Cấu hình mặc định — Sheet mới:
 * https://docs.google.com/spreadsheets/d/1jsAZvVDgr-ju-WPi6izYcslKQA2DCvKLMnwMS14eam4/edit?gid=1069887904#gid=1069887904
 *
 * Apps Script project (edit):
 * https://script.google.com/u/0/home/projects/1LOfAA6goLw2Z04Xd-a9MeN7qR6vwRa4OPTzm8OD82kYOAALiu8hnN519/edit
 *
 * Webhook Web App (Deploy):
 * https://script.google.com/macros/s/AKfycbxixHl9DfZlcIUWFmfOC1lMMDVxtHMA_lpqSZraUqv9Q1PhDuaoS6MCwuAYx0iGonak/exec
 */
const empty: SheetConfig = {
  sheetId: "1jsAZvVDgr-ju-WPi6izYcslKQA2DCvKLMnwMS14eam4",
  csvUrl: "",
  gid: "1069887904",
  sheetName: "san-pham-vuon-cua-mit",
  webhookUrl:
    "https://script.google.com/macros/s/AKfycbxixHl9DfZlcIUWFmfOC1lMMDVxtHMA_lpqSZraUqv9Q1PhDuaoS6MCwuAYx0iGonak/exec",
  ordersSheetName: "DonHang",
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
