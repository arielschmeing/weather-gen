import { MenuViewContext } from "@/app/context/menuView/useMenuView.context";
import { useAuthStorage } from "@/app/store/AuthStorage";
import type { ViewType } from "@/app/types/global";
import { ROUTER_PATHS } from "@/lib/app.constants";
import { use } from "react";
import { useNavigate } from "react-router";

interface ButtonProps {
  name: ViewType;
  text: string;
  onClick?: () => void;
}

export const useMenu = () => {
  const { refreshToken } = useAuthStorage();
  const { setView, view } = use(MenuViewContext);
  const navigate = useNavigate();

  const defaultOnClick = (button: ButtonProps) => {
    setView(button.name);
    navigate(ROUTER_PATHS.DASHBOARD);
  };

  const actionButtons = {
    logout: {
      text: "Logout",
      onClick: () => {
        refreshToken(null);
        navigate(ROUTER_PATHS.LOGIN);
      },
    },
    user: {
      onClick: () => {
        setView("user");
        navigate(ROUTER_PATHS.USER);
      },
    },
    home: {
      onClick: () => {
        setView("current");
        navigate(ROUTER_PATHS.DASHBOARD);
      },
    },
  };

  const buttons: ButtonProps[] = [
    {
      name: "current",
      text: "Clima Atual",
    },
    {
      name: "temperature",
      text: "Temperatura",
    },
    {
      name: "umidade",
      text: "Humidade",
    },
    {
      name: "wind",
      text: "Vento",
    },
    {
      name: "precipitation_probability",
      text: "Precipitação",
    },
    {
      name: "explorer",
      text: "Explorar",
      onClick: () => {
        setView("explorer");
        navigate(ROUTER_PATHS.EXPLORER);
      },
    },
  ];

  return {
    buttons,
    actionButtons,
    defaultOnClick,
    view,
  };
};
