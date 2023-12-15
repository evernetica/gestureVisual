import { createContext, useContext } from "react";

type HistoryContextTypes = {
  setSearchString: null | string;
  searchString?: () => void;
  isScanning: boolean;
  filters: {
    [key: string]: string;
  };
};

const HistoryContext = createContext<HistoryContextTypes>({
  setSearchString: () => null,
});

const HistoryContextProvider = HistoryContext.Provider;
const useHistoryContext = (): HistoryContextTypes => useContext(HistoryContext);

export { HistoryContextProvider, useHistoryContext };
