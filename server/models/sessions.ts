import { defineModel } from "../../@bolt/kv-model/mod.ts";
import { Users } from "./users.ts";

export const Sessions = defineModel<{
  userId: string;
  createTime: number;
}>("Sessions", {
  extras(value) {
    return {
      async getUser() {
        return (await Users.getById(value.userId)).value;
      },
    };
  },
});
