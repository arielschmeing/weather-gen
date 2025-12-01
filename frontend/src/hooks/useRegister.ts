import type { InputAttributes, Register } from "@/app/types/global";
import { useForm } from "./useForm";
import type { ChangeEvent } from "react";
import { useAuthStorage } from "@/app/store/AuthStorage";
import { useNavigate } from "react-router";
import { ROUTER_PATHS } from "@/lib/app.constants";
import { userService } from "@/services/user.service";

const validations = {
  email: (value: string) => {
    if (!value) return "(Email obrigatório)";
  },

  password: (value: string) => {
    if (!value) return "(Senha obrigatória)";
  },

  name: (value: string) => {
    if (!value) return "(Nome obrigatório)";
  },
};

export const useRegister = () => {
  const { refreshToken, accessToken, setUser, payload } = useAuthStorage();
  const navigate = useNavigate();
  const { data, errors, setValue, submit } = useForm<Register>({ validations });

  const inputs: InputAttributes<Register>[] = [
    {
      text: "Email",
      type: "email",
      id: "email",
      placeholder: "Ex.: user@email.com",
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        setValue("email", e.target.value),
    },
    {
      text: "Senha",
      type: "password",
      id: "password",
      placeholder: "Insira sua senha.",
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        setValue("password", e.target.value),
    },
    {
      text: "Nome",
      type: "text",
      id: "name",
      placeholder: "Insira seu nome de usuário.",
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        setValue("name", e.target.value),
    },
  ];

  const actions = {
    register: {
      onClick: async () => {
        if (!submit()) return;

        refreshToken(null);

        const isRegistred = await userService.register(data);

        if (!isRegistred) return;

        const token = await userService.login({
          email: data.email,
          password: data.password,
        });

        if (!token) return;

        refreshToken(token);
        const id = payload()?.sub;
        if (!id || !accessToken) return;

        const user = await userService.getUser({
          id,
          token: accessToken,
        });

        if (!user) return;
        setUser(user);
        navigate(ROUTER_PATHS.DASHBOARD);
      },
    },
    login: {
      onClick: () => navigate(ROUTER_PATHS.LOGIN),
    },
  };

  return {
    errors,
    inputs,
    actions,
  };
};
