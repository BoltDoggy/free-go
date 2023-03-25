export const doDrop = async (
  ctx: {
    getType: (
      to: { x: number; y: number },
      from: { x: number; y: number }
    ) => Promise<"friend" | "enemy" | "blank">;
    excludes: [x: number, y: number][];
    killEnemies: (e: [x: number, y: number][]) => void;
  },
  x: number,
  y: number
) => {
  const { getType, excludes, killEnemies } = ctx;
  excludes.push([x, y]);
  const wasd = [
    [x, y - 1],
    [x - 1, y],
    [x, y + 1],
    [x + 1, y],
  ];
  const types = await Promise.all(
    wasd.map(
      async ([_x, _y]): Promise<
        [number, number, "friend" | "enemy" | "blank"]
      > => {
        const type = await getType({ x: _x, y: _y }, { x, y });
        return [_x, _y, type];
      }
    )
  );
  const enemies = types.filter(([, , type]) => type === "enemy");
  const enemyStatus = await Promise.all(
    enemies.map(async ([x, y]): Promise<[number, number, boolean]> => {
      return [x, y, await verifyAlive(ctx, x, y)];
    })
  );
  const notAliveEnemies = enemyStatus.filter(([, , isAlive]) => !isAlive);
  if (notAliveEnemies.length) {
    let allEnemies: any[] = notAliveEnemies;
    for (let index = 0; index < notAliveEnemies.length; index++) {
      const [x, y] = notAliveEnemies[index];
      allEnemies = allEnemies.concat(await findFriends({
        ...ctx,
        excludes: []
      }, x, y));
    }
    console.log("bolt allEnemies", notAliveEnemies, allEnemies);
    killEnemies(allEnemies);
    return true;
  }
  if (await verifyAlive(ctx, x, y)) return true;
  return false;
};

export const findFriends = async (
  ctx: {
    getType: (
      to: { x: number; y: number },
      from: { x: number; y: number }
    ) => Promise<"friend" | "enemy" | "blank">;
    excludes: [x: number, y: number][];
  },
  x: number,
  y: number
) => {
  const { getType, excludes } = ctx;
  excludes.push([x, y]);
  const wasd = [
    [x, y - 1],
    [x - 1, y],
    [x, y + 1],
    [x + 1, y],
  ];
  const filted = wasd.filter(
    ([x, y]) => !excludes.find(([_x, _y]) => _x === x && _y === y)
  );
  const types = await Promise.all(
    filted.map(
      async ([_x, _y]): Promise<
        [number, number, "friend" | "enemy" | "blank"]
      > => {
        const type = await getType({ x: _x, y: _y }, { x, y });
        return [_x, _y, type];
      }
    )
  );
  const friends = types.filter(([, , type]) => type === "friend");
  console.log('bolt friends', friends)
  let allFriends: any[] = friends;
  for (let index = 0; index < friends.length; index++) {
    const [x, y] = friends[index];
    allFriends = allFriends.concat(await findFriends(ctx, x, y));
  }
  return allFriends;
};

export const verifyAlive = async (
  ctx: {
    getType: (
      to: { x: number; y: number },
      from: { x: number; y: number }
    ) => Promise<"friend" | "enemy" | "blank">;
    excludes: [x: number, y: number][];
  },
  x: number,
  y: number
) => {
  const { getType, excludes } = ctx;
  const wasd = [
    [x, y - 1],
    [x - 1, y],
    [x, y + 1],
    [x + 1, y],
  ];
  const filted = wasd.filter(
    ([x, y]) => !excludes.find(([_x, _y]) => _x === x && _y === y)
  );
  excludes.push([x, y]);
  const types = await Promise.all(
    filted.map(
      async ([_x, _y]): Promise<
        [number, number, "friend" | "enemy" | "blank"]
      > => {
        const type = await getType({ x: _x, y: _y }, { x, y });
        return [_x, _y, type];
      }
    )
  );
  const hasBlank = types.find(([, , type]) => type === "blank");
  if (hasBlank) return true;
  const friends = types.filter(([, , type]) => type === "friend");
  if (!friends) return false;
  for (let index = 0; index < friends.length; index++) {
    const [x, y] = friends[index];
    if (await verifyAlive(ctx, x, y)) return true;
  }
  return false;
};
