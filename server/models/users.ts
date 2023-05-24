import { defineModel } from "../../@bolt/kv-model/mod.ts";

export const Users = defineModel<{
  email: string;
  nickname: string;
  avatar: string;
}>("Users");
