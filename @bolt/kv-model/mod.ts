const kvPromise = Deno.openKv();

export const defineModel = <T, IndexKey extends keyof T = keyof T>(
  name: string,
  props: {
    indexKeys?: IndexKey[];
    extras?: (value: T) => Record<string, unknown>;
  } = {}
) => {
  type Ti = T & {
    _id: string;
  };

  const { indexKeys = [], extras = () => ({}) } = props;

  const model = {
    $rebuildIndex: async () => {
      const list = await model.list();
      /** TODO: 使用 Promise 提高性能 */
      for await (const item of list) {
        await model.$set(item.value);
      }
    },
    $$clear: async () => {
      const list = await model.list();
      /** TODO: 使用 Promise 提高性能 */
      for await (const item of list) {
        await model.$delete(item.value);
      }
    },
    $delete: async (value: Ti) => {
      const kv = await kvPromise;
      const { _id } = value;
      /** TODO: 使用事务防止内容不一致 */
      indexKeys.forEach((indexKey) => {
        kv.delete([
          `${name}_by_${String(indexKey)}`,
          String(value[indexKey]),
          _id,
        ]);
      });
      return kv.delete([name, _id]);
    },
    $set: async (value: Ti) => {
      const kv = await kvPromise;
      const { _id } = value;
      /** TODO: 使用事务防止内容不一致 */
      indexKeys.forEach((indexKey) => {
        kv.set(
          [`${name}_by_${String(indexKey)}`, String(value[indexKey]), _id],
          value
        );
      });
      console.log(name, _id, value);
      return kv.set([name, _id], value);
    },
    list: async () => {
      const kv = await kvPromise;
      return kv.list<Ti>({ prefix: [name] });
    },
    listBy: async (indexKey: IndexKey, indexKeyValue?: string) => {
      const kv = await kvPromise;
      if (indexKeyValue) {
        return kv.list<Ti>({
          prefix: [`${name}_by_${String(indexKey)}`, indexKeyValue],
        });
      }
      return kv.list<Ti>(
        { prefix: [`${name}_by_${String(indexKey)}`] },
        {
          reverse: true,
        }
      );
    },
    getById: async (id: string) => {
      const kv = await kvPromise;
      return kv.get<Ti>([name, id]);
    },
    getByIds: async (ids: string[]) => {
      const kv = await kvPromise;
      return kv.getMany<Ti[]>(ids.map((id) => [name, id]));
    },
    deleteById: async (id: string) => {
      const item = await model.getById(id);
      return item.value && model.$delete(item.value);
    },
    deleteByIds: async (ids: string[]) => {
      const list = await model.getByIds(ids);
      return Promise.allSettled(
        list.map(async (item) => {
          item.value && (await model.$delete(item.value));
        })
      );
    },
    create: (value: T) => {
      const _id = crypto.randomUUID();
      return model.wrap({
        ...value,
        _id,
      });
    },
    wrap: (value: Ti) => {
      return {
        ...extras(value),
        value,
        save: async () => {
          return await model.$set(value);
        },
        remove: async () => {
          return await model.$delete(value);
        },
      };
    },
  };
  return model;
};
