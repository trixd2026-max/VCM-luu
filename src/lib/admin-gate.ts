/**
 * Bảo vệ /quan-ly bằng PIN đơn giản (client-side).
 * Mặc định: 662166 (6 số cuối SĐT shop). Đổi trong localStorage sau khi vào được.
 */

const SESSION_KEY = "vcm-admin-session";
const PIN_KEY = "vcm-admin-pin";

/** PIN mặc định — đổi sau khi đăng nhập tại /quan-ly */
export const DEFAULT_ADMIN_PIN = "662166";

const SESSION_HOURS = 12;

export function getStoredPin(): string {
  try {
    const p = localStorage.getItem(PIN_KEY);
    if (p && p.trim().length >= 4) return p.trim();
  } catch {
    /* ignore */
  }
  return DEFAULT_ADMIN_PIN;
}

export function setStoredPin(pin: string) {
  localStorage.setItem(PIN_KEY, pin.trim());
}

export function isAdminUnlocked(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    const maxAge = SESSION_HOURS * 60 * 60 * 1000;
    if (Date.now() - ts > maxAge) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function unlockAdmin(pin: string): boolean {
  if (pin.trim() !== getStoredPin()) return false;
  sessionStorage.setItem(SESSION_KEY, String(Date.now()));
  return true;
}

export function lockAdmin() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
