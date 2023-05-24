import { defineModel } from "../../@bolt/kv-model/mod.ts";
import { Users } from "./users.ts";

export const Todos = defineModel<{
  userId: string;
  content: string;
}>("Todos", {
  extras(value) {
    return {
      async getUser() {
        return (await Users.getById(value.userId)).value;
      },
    };
  },
});
