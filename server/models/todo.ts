import { defineModel } from "../../@bolt/kv-model/mod.ts";

export const todos = defineModel<{
  content: string;
}>("todos");

todos.rebuildIndex();