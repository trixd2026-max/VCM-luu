export function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
}

export function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return raw;
}

export function makeOrderId() {
  const now = new Date();
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VCM-${stamp}-${rand}`;
}
