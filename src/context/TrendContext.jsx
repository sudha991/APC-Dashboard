import { createContext, useContext, useState } from "react";

const TrendContext = createContext();

export const TrendProvider = ({ children }) => {

  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag, label) => {
    setSelectedTags(prev => {
      const exists = prev.find(x => x.tag === tag);

      if (exists) {
        return prev.filter(x => x.tag !== tag);
      }

      return [...prev, { tag, label }];
    });
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  return (
    <TrendContext.Provider
      value={{
        selectedTags,
        toggleTag,
        clearTags
      }}
    >
      {children}
    </TrendContext.Provider>
  );
};

export const useTrend = () => useContext(TrendContext);