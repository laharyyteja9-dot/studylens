"use client";

import { useStore } from "@/lib/store";
import { useEffect } from "react";

export default function ThemeApplier() {
  const { state } = useStore();

  useEffect(() => {
    if (state.theme === 'warm-dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  return null;
}
