import { defineModel } from "../../@bolt/kv-model/mod.ts";

export const Users = defineModel<
  {
    _accountId: string;
    email?: string;
    nickname?: string;
    avatar?: string;
  },
  "_accountId"
>("Users", {
  uniqueKeys: ["_accountId"],
});
