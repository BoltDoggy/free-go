import { h } from "npm:preact";
import { css } from "npm:@emotion/css";
import Test from "../../mdx/test.mdx";

export default () => {
  return (
    <Test>
      <div
        className={css`
          color: red;
        `}
      >
        我的
      </div>
    </Test>
  );
};
