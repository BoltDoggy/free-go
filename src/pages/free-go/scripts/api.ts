import type { cp, cps } from "../../../../server/graphql/graphql.generated.ts";

const gql = ([queryDefine]: TemplateStringsArray) => {
  return <Variables, Result>(name: string, defineOption?: RequestInit) => {
    const query = queryDefine.replace("__", name);
    return async (
      variables?: Variables,
      option?: RequestInit
    ): Promise<Result> => {
      const res = await fetch(`/graphql?name=${name}`, {
        method: "post",
        body: JSON.stringify({
          query,
          variables,
        }),
        ...defineOption,
        ...option,
      });
      const { data, errors } = await res.json();
      console.log("=>>", data);
      if (errors) {
        throw errors;
      }
      return data;
    };
  };
};

export const queryCps = gql`
  query __($x: Int, $y: Int, $r: Int) {
    cps(x: $x, y: $y, r: $r) {
      my {
        x
        y
      }
      other {
        x
        y
      }
    }
  }
`<
  {
    x: number;
    y: number;
    r: number;
  },
  {
    cps: cps;
  }
>("queryCps");

export const addCp = gql`
  mutation __($x: Int, $y: Int) {
    add(x: $x, y: $y)
  }
`<
  {
    x: number;
    y: number;
  },
  {
    add: boolean;
  }
>("addCps");
