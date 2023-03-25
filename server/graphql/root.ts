import { cp, cps } from "./graphql.generated.ts";
import { doDrop, verifyAlive } from "@shared/go.ts";

const userMap = new Map<
  string,
  {
    home: [x: number, y: number];
    cps: { x: number; y: number }[];
  }
>();
const cpMap = new Map<string, string>();

export default {
  cps(
    { x, y, r }: { x: number; y: number; r: number },
    { freeGo }: { freeGo: string }
  ): cps {
    const my = userMap.get(freeGo);
    if (!my) {
      userMap.set(freeGo, {
        home: [0, 0],
        cps: [],
      });
    }
    let other: cp[] = [];
    userMap.forEach((value, key) => {
      if (key !== freeGo) {
        other = other.concat(
          value.cps.filter((ele) => cpMap.get(`${ele.x}.${ele.y}`))
        );
      }
    });
    return {
      my: my?.cps.filter((ele) => cpMap.get(`${ele.x}.${ele.y}`) === freeGo),
      other,
    };
  },
  async add({ x, y }: { x: number; y: number }, { freeGo }: { freeGo: string }) {
    const my = userMap.get(freeGo);
    if (!my) return false;
    const can = await doDrop(
      {
        async getType(to, from) {
          const _to = cpMap.get(`${to.x}.${to.y}`);
          if (!_to) return "blank";
          const _from = cpMap.get(`${from.x}.${from.y}`) || freeGo;
          console.log(to, from, _to, _from)
          return _to === _from ? "friend" : "enemy";
        },
        excludes: [],
        killEnemies(enemies) {
          enemies.forEach((e) => {
            cpMap.delete(`${e[0]}.${e[1]}`);
          });
        },
      },
      x,
      y
    );
    console.log('bolt', x, y, can)
    if (!can) return false;
    my.cps.push({ x, y });
    cpMap.set(`${x}.${y}`, freeGo);
    return true;
  },
};
