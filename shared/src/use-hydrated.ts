"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during server rendering and the first client render, true afterwards.
 * Forms use it to keep their submit button disabled until their JS handler is attached —
 * otherwise an early submit falls back to a native GET and puts every field (even a
 * password) into the URL.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
