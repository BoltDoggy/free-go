const kvPromise = Deno.openKv();

export const defineModel = <T>(
  name: string,
  props: { indexs?: keyof T[] } = {}
) => {
  const { indexs = [] } = props;

  const model = {
    rebuildIndex: async () => {
      const kv = await kvPromise;
      const list = await model.list();
      for await (const iterator of object) {
      }
    },
    list: async () => {
      const kv = await kvPromise;
      return kv.list({ prefix: [name] });
    },
    create: (obj: T) => {
      const id = crypto.randomUUID();
      const _obj = {
        ...obj,
        id,
      };

      return {
        save: async () => {
          const kv = await kvPromise;

          return kv.set([name, id], _obj);
        },
      };
    },
    wrap: (
      obj: T & {
        id: string;
      }
    ) => {
      
    },
  };
  return model;
};
