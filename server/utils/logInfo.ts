import { info } from "https://deno.land/std@0.127.0/log/mod.ts";
import { stringify } from "https://deno.land/std@0.110.0/encoding/yaml.ts";

export const logJson = (json: Record<string, unknown>) => {
  console.log('\n');
  info("\n" + stringify(json));
};
