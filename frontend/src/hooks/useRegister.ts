import type { InputAttributes, Register } from "@/app/types/global";
import { useForm } from "./useForm";
import type { ChangeEvent } from "react";
import { useAuthStorage } from "@/app/store/AuthStorage";
import { useNavigate } from "react-router";
import { ROUTER_PATHS } from "@/lib/app.constants";
import { userService } from "@/services/user.service";
import { useToast } from "./useToast";

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
  const { refreshToken, setUser } = useAuthStorage();
  const navigate = useNavigate();
  const { data, errors, setValue, submit } = useForm<Register>({ validations });
  const { error } = useToast();

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
        if (!submit()) return error("Insira todos os campos de cadastro.");

        try {
          refreshToken(null);

          await userService.register(data);

          const token = await userService.login({
            email: data.email,
            password: data.password,
          });

          refreshToken(token);

          const parts = token.split(".");
          const decodedPayload = JSON.parse(atob(parts[1]));
          const id = decodedPayload?.sub;

          if (!id) {
            throw new Error("Erro ao obter ID do usuário.");
          }

          const user = await userService.getUser({
            id,
            token,
          });

          setUser(user);
          navigate(ROUTER_PATHS.DASHBOARD);
        } catch {
          return error("Usuário não cadastrado. Email já existe ou servidor indisponível.");
        }
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
