import { defineModel } from "../../@bolt/kv-model/mod.ts";

export const Passwords = defineModel<{
  userId: string;
  signature: ArrayBuffer;
  cryptokey: ArrayBuffer;
}>("Passwords", {
  indexKeys: ["userId"],
});

const enc = new TextEncoder();

const cryptokey = crypto.getRandomValues(new Uint8Array(64));

const key = await crypto.subtle.importKey(
  "raw",
  cryptokey,
  {
    name: "HMAC",
    hash: { name: "SHA-512" },
  },
  false,
  ["sign", "verify"]
);

const signature = await crypto.subtle.sign(
  "HMAC",
  key,
  enc.encode("myawesomedata")
);
console.log(
  await Passwords.create({
    userId: "xxx",
    cryptokey,
    signature,
  }).save()
);

const a = (await (await Passwords.listBy("userId", "xxx")).next()).value?.value;

console.log(a);

const cryptokey2 = a && await crypto.subtle.importKey(
  "raw",
  a.cryptokey,
  {
    name: "HMAC",
    hash: { name: "SHA-512" },
  },
  false,
  ["sign", "verify"]
);

const result =
  a && cryptokey2 &&
  (await crypto.subtle.verify(
    "HMAC",
    cryptokey2,
    a.signature,
    enc.encode("myawesomedata")
  ));

console.log(result);
