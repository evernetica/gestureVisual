import { createContext, useContext } from "react";

type HistoryContextTypes = {
  history: [object];
  setHistory: () => void;
};

const HistoryContext = createContext<HistoryContextTypes>({});

const HistoryContextProvider = HistoryContext.Provider;
const useHistoryContext = (): HistoryContextTypes => useContext(HistoryContext);

export { HistoryContextProvider, useHistoryContext };
