import type { GetUserRequest, Login, Register, User } from "@/app/types/global";
import { API_PATHS } from "@/lib/app.constants";
import axios, { HttpStatusCode } from "axios";

interface LoginResponse {
  access_token: string;
}

const cacheUser = new Map<string, User>();

export const userService = {
  async login({ email, password }: Login): Promise<string> {
    const { data, status } = await axios.post<LoginResponse>(API_PATHS.LOGIN, {
      email,
      password,
    });

    if (status !== HttpStatusCode.Ok) throw new Error("Erro ao logar usuário.");

    return data.access_token;
  },
  async register({
    email,
    password,
    name,
  }: Register): Promise<true> {
    const { status } = await axios.post(API_PATHS.USERS, {
      email,
      password,
      name,
    });

    if (status != HttpStatusCode.Created)
      throw new Error("Erro ao criar usuário.");

    return true;
  },
  async getUser({ id, token }: GetUserRequest): Promise<User> {
    if (cacheUser.has(token)) return cacheUser.get(token)!;

    const { data, status } = await axios.get(`${API_PATHS.USERS}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (status !== HttpStatusCode.Ok)
      throw new Error("Erro ao tentar retornar usuário.");

    cacheUser.set(token, data);
    return data;
  },
  async changeName(name: string, token: string) {
    const { status } = await axios.put(
      API_PATHS.USER_NAME,
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (status !== HttpStatusCode.Ok)
      throw new Error("Erro ao mudar o nome do usuário");

    return true;
  },
  async changePassword(password: string, token: string) {
    const { status } = await axios.put(
      API_PATHS.USER_PASSWORD,
      { password },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (status !== HttpStatusCode.Ok)
      throw new Error("Erro ao mudar a senha do usuário do usuário");

    return true;
  },
  async remove(token: string) {
    const { status } = await axios.delete(API_PATHS.USERS, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (status !== HttpStatusCode.NoContent)
      throw new Error("Erro ao deletar usuário");

    return true;
  },
};
