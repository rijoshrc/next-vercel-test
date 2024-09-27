"use client";

import { createContext, useContext, useState } from "react";

export interface Favorite {
  hid: number;
  dur: number;
  arv: string;
  adu: number;
  pet: number;
}

interface FavoriteContextProps {
  favoriteList: Favorite[];
  toggleFavorite: (fav: Favorite) => void;
  clearFavorites: () => void;
  removeFavorite: (id: number) => void;
}

const FavoriteContext = createContext<FavoriteContextProps | null>(null);

const FAVORITE_COOKIE_NAME = "meerhusFavorites";

const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const favCookies = window
    ? window.localStorage.getItem(FAVORITE_COOKIE_NAME) || "[]"
    : "[]";

  const [favoriteList, setFavoriteList] = useState<Favorite[]>(
    JSON.parse(favCookies as string)
  );

  const addFavorite = (fav: Favorite) => {
    const updatedFavorites = [...favoriteList, fav];
    setFavoriteList(updatedFavorites);
    if (!window) return;
    window.localStorage.setItem(
      FAVORITE_COOKIE_NAME,
      JSON.stringify(updatedFavorites)
    );
  };

  const removeFavorite = (id: number) => {
    const updatedFavorites = favoriteList.filter((f) => f.hid !== id);
    setFavoriteList(updatedFavorites);
    if (!window) return;
    window.localStorage.setItem(
      FAVORITE_COOKIE_NAME,
      JSON.stringify(updatedFavorites)
    );
  };

  const toggleFavorite = (fav: Favorite) => {
    if (favoriteList.some((f) => f.hid === fav.hid)) {
      removeFavorite(fav.hid);
    } else {
      addFavorite(fav);
    }
  };

  const clearFavorites = () => {
    setFavoriteList([]);
    if (!window) return;
    window.localStorage.setItem(FAVORITE_COOKIE_NAME, JSON.stringify([]));
  };

  return (
    <FavoriteContext.Provider
      value={{
        favoriteList,
        toggleFavorite,
        clearFavorites,
        removeFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export default FavoriteProvider;

export const useFavorite = () => {
  const context = useContext(FavoriteContext);

  if (!context) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }

  return context;
};
