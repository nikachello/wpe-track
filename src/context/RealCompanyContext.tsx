"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { z } from "zod";
import { realCompanySchema } from "@/utils/zodSchemas";

export type CompanyData = z.infer<typeof realCompanySchema> & { id: string };

type CompanyContextType = {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  editData: CompanyData | null;
  setEditData: Dispatch<SetStateAction<CompanyData | null>>;
  resetEditData: () => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<CompanyData | null>(null);

  const resetEditData = () => {
    setEditData(null);
  };

  return (
    <CompanyContext.Provider
      value={{
        drawerOpen,
        setDrawerOpen,
        editData,
        setEditData,
        resetEditData,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompanyContext must be used within a CompanyProvider");
  }
  return context;
};
