import { MenuViewContext } from "@/app/context/menuView/useMenuView.context";
import type { Item } from "@/app/types/global";
import { explorerService } from "@/services/explorer.service";
import { use, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useToast } from "./useToast";
import { useAuthStorage } from "@/app/store/AuthStorage";

export const useItem = () => {
  const { id } = useParams();
  const { setView } = use(MenuViewContext);
  const { error } = useToast();
  const { accessToken } = useAuthStorage();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    setView("explorer");
    const fetchItem = async () => {
      try {
        const response = await explorerService.getItem(
          accessToken!,
          Number(id)
        );
        setItem(response);
      } catch {
        return error("Não foi possível vizualizar item.");
      }
    };
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    item,
  };
};
