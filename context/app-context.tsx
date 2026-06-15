"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AppContextType {
  semestreId: string | undefined;
  cambiarSemestreId: (semestreId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [semestreId, setSemestreId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const savedSemestreId = localStorage.getItem("semestreId");

    if (savedSemestreId) setSemestreId(savedSemestreId);
  }, []);

  const cambiarSemestreId = (semestreId: string) => {
    setSemestreId(semestreId);
    localStorage.setItem("semestreId", semestreId);
  };

  return <AppContext.Provider value={{ semestreId, cambiarSemestreId }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp debe ser utilizado dentro de un AppProvider");
    return context;
};