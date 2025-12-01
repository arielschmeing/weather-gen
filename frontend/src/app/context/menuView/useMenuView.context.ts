import { createContext, type Dispatch, type SetStateAction } from "react";
import type { ViewType } from "../../types/global";

interface MenuViewProps {
  view: ViewType;
  setView: Dispatch<SetStateAction<ViewType>>;
}

export const MenuViewContext = createContext<MenuViewProps>({
  view: "current",
  setView: () => null,
});
