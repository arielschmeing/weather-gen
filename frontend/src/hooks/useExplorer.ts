import { MenuViewContext } from "@/app/context/menuView/useMenuView.context";
import { useAuthStorage } from "@/app/store/AuthStorage";
import type { ItemsPagination } from "@/app/types/global";
import { explorerService } from "@/services/explorer.service";
import { use, useEffect, useState } from "react";
import { useToast } from "./useToast";

export const useExplorer = () => {
  const { setView } = use(MenuViewContext);
  const { accessToken } = useAuthStorage();
  const { error } = useToast();
  const [items, setItems] = useState<ItemsPagination | null>(null);

  useEffect(() => {
    setView("explorer");
    const fetchItems = async () => {
      try {
        const items = await explorerService.getItems(accessToken!);
        setItems(items);
      } catch {
        return error("Não foi possível mostrar itens.");
      }
    };
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paginationAction = async (url: string | null) => {
    if (!url || !accessToken) return;

    const offset = new URL(url).searchParams.get("offset");
    const response = await explorerService.getItems(
      accessToken!,
      Number(offset)
    );

    setItems(response);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    items,
    paginationAction,
  };
};
