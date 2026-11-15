import { useState, useEffect } from "react";

/**
 * useTheme
 *
 * Prioridade de resolução do tema inicial:
 * 1. Preferência salva pelo usuário no localStorage ("flavordash-theme")
 * 2. Preferência do sistema operacional/navegador (prefers-color-scheme)
 *
 * Aplica/remove a classe CSS "dark" no <html> e persiste a escolha.
 */
const STORAGE_KEY = "flavordash-theme";

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    // 1. Verifica preferência salva
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) return saved === "dark";

    // 2. Detecta preferência do sistema
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Aplica/remove a classe no <html> toda vez que isDark mudar
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  // Escuta mudanças na preferência do sistema enquanto o usuário
  // ainda não fez uma escolha manual (sem item no localStorage)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      if (localStorage.getItem(STORAGE_KEY) === null) {
        setIsDark(e.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return { isDark, toggleTheme };
}
