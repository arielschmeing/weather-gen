import type { Item, ItemsPagination } from "@/app/types/global";
import { API_PATHS } from "@/lib/app.constants";
import axios, { HttpStatusCode } from "axios";

const cacheItems = new Map<string, ItemsPagination>();
const cacheItem = new Map<string, Item>();

export const explorerService = {
  async getItems(token: string, offset = 0, limit = 20) {
    const CACHE_KEY = `${token}${offset}${limit}`;

    if (cacheItems.has(CACHE_KEY)) return cacheItems.get(CACHE_KEY)!;

    const { data, status } = await axios.get<ItemsPagination>(
      `${API_PATHS.EXPLORER_ITEMS}?offset=${offset}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (status !== HttpStatusCode.Ok)
      throw new Error("Erro ao ver registro de itens.");

    cacheItems.set(CACHE_KEY, data);
    return data;
  },

  async getItem(token: string, id: number) {
    const CACHE_KEY = `${token}${id}`;

    if (cacheItem.has(CACHE_KEY)) return cacheItem.get(CACHE_KEY)!;

    const { data, status } = await axios.get<Item>(
      `${API_PATHS.EXPLORER_ITEMS}/${id}/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (status !== HttpStatusCode.Ok) throw new Error("Erro ao retornar item");

    cacheItem.set(CACHE_KEY, data);
    return data;
  },
};
