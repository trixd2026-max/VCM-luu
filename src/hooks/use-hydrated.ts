import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/** Wait until the cart persist layer has read localStorage (or 100ms). */
export function useCartReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const finish = () => setReady(true);
    if (useCart.persist.hasHydrated()) {
      finish();
      return;
    }
    const unsub = useCart.persist.onFinishHydration(finish);
    const t = window.setTimeout(finish, 120);
    return () => {
      unsub();
      window.clearTimeout(t);
    };
  }, []);
  return ready;
}
