import { MenuViewContext } from "@/app/context/menuView/useMenuView.context";
import { useAuthStorage } from "@/app/store/AuthStorage";
import { ROUTER_PATHS } from "@/lib/app.constants";
import { userService } from "@/services/user.service";
import { CalendarDays, Mail, User } from "lucide-react";
import {
  use,
  useEffect,
  useState,
  type ChangeEvent,
  type ElementType,
} from "react";
import { useNavigate } from "react-router";
import { useToast } from "./useToast";

interface ItemProps {
  title: string;
  value: string;
  icon: ElementType;
}

const MIN_PASSWORD = 3;

export const useUser = () => {
  const { setView } = use(MenuViewContext);
  const {
    payload,
    refreshToken,
    accessToken: token,
    user,
    setUser,
  } = useAuthStorage();
  const { error, success } = useToast();
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setView("user");
    const fetchUser = async () => {
      const id = payload()?.sub;
      if (!id || !token) return;

      const user = await userService.getUser({
        id,
        token,
      });

      if (!user) {
        navigate(ROUTER_PATHS.LOGIN);
        return;
      }

      setUser(user);
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setView]);

  const items: ItemProps[] = [
    {
      title: "Criada em",
      value: `${
        user?.createdAt
          ? new Date(user.createdAt)
              .toISOString()
              .split("T")[0]
              .replace(/-/g, "/")
          : "---"
      }`,
      icon: CalendarDays,
    },
    {
      title: "Email",
      value: `${user?.email}`,
      icon: Mail,
    },
    {
      title: "Nome",
      value: `${user?.name}`,
      icon: User,
    },
  ];

  const inputs = [
    {
      title: "Nome",
      props: {
        defaultValue: `${user?.name}`,
        onChange: (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value),
      },
      onClick: async () => {
        if (!name || name === user?.name || !token)
          return error("Nome inválido. Tente novamente.");

        try {
          await userService.changeName(name, token);
          setUser({
            ...user!,
            name,
          });
        } catch {
          return error("Erro ao mudar nome. Tente novamente.");
        }

        return success("Nome mudado.");
      },
    },
    {
      title: "Senha",
      props: {
        placeholder: "Digite a nova senha aqui.",
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value),
        type: "password",
        defaultValue: password,
      },
      onClick: async () => {
        if (!password || password.length <= MIN_PASSWORD || !token)
          return error("Senha inválida. Tente novamente.");

        try {
          await userService.changePassword(password, token);
          setPassword("");
        } catch {
          return error("Erro ao mudar senha. Tente novamente.")
        }

        return success("Senha mudada")
      },
    },
  ];

  const handlerDeleteAccount = async () => {
    if (!token) return;
    const response = await userService.remove(token);

    if (!response) return;

    setUser(null);
    refreshToken(null);
    navigate(ROUTER_PATHS.LOGIN);
  };

  return {
    user,
    items,
    inputs,
    handlerDeleteAccount,
  };
};
