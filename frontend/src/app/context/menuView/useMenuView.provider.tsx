import { useState, type PropsWithChildren } from "react";
import { MenuViewContext } from "./useMenuView.context";
import type { ViewType } from "@/app/types/global";

export const MenuViewProvider = ({ children }: PropsWithChildren) => {
  const [view, setView] = useState<ViewType>("current");

  return (
    <MenuViewContext.Provider
      value={{
        view,
        setView,
      }}
    >
      {children}
    </MenuViewContext.Provider>
  );
};
