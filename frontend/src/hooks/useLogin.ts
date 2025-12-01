import { ROUTER_PATHS } from "@/lib/app.constants";
import { useNavigate } from "react-router";
import { useForm } from "./useForm";
import type { ChangeEvent } from "react";
import { useAuthStorage } from "@/app/store/AuthStorage";
import { userService } from "@/services/user.service";
import type { Login } from "@/app/types/global";
const validations = {
  email: (value: string) => {
    if (!value) {
      return "(Email obrigatório)";
    }
  },

  password: (value: string) => {
    if (!value) {
      return "(Senha obrigatória)";
    }
  },
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { refreshToken, payload, setUser, accessToken } = useAuthStorage();
  const { data, errors, setValue, submit } = useForm<Login>({ validations });

  const inputs = {
    email: {
      type: "email",
      id: "email",
      placeholder: "Email",
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        setValue("email", e.target.value),
    },
    password: {
      type: "password",
      id: "password",
      placeholder: "Senha",
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        setValue("password", e.target.value),
    },
  };

  const actions = {
    login: {
      onClick: async () => {
        if (!submit()) return;

        const token = await userService.login(data);
    
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
    register: {
      onClick: () => navigate(ROUTER_PATHS.REGISTER),
    },
  };

  return {
    actions,
    inputs,
    errors,
  };
};
