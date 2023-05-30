import { h, render, JSX } from "npm:preact";
import { css, cx } from "npm:@emotion/css";

export default (props: { children: JSX.Element; fontFamily: number }) => {
  const { children, fontFamily } = props;
  return (
    <div
      className={cx(
        css`
          padding: 0 16px;

          h1 {
            font-size: 28px;
          }
          h2 {
            font-size: 26px;
          }
          h3 {
            font-size: 24px;
          }
          h4 {
            font-size: 22px;
          }
          h5 {
            font-size: 20px;
          }
          h6 {
            font-size: 18px;
          }
          blockquote {
            position: relative;
            font-size: 16px;
            line-height: 22.5px;
            &::before {
              display: block;
              content: ">";
              position: absolute;
              top: 0;
              left: -32px;
              color: #999;
            }
          }
          p {
            font-size: 16px;
          }
        `,
        [
          css`
            font-family: "Courier New", Courier, monospace;
          `,
          css`
            font-family: "Franklin Gothic Medium", "Arial Narrow", Arial,
              sans-serif;
          `,
          css`
            font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
              sans-serif;
          `,
          css`
            font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
          `,
          css`
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          `,
          css`
            font-family: "Times New Roman", Times, serif;
          `,
          css`
            font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
              "Lucida Sans", Arial, sans-serif;
          `,
          css`
            font-family: Arial, Helvetica, sans-serif;
          `,
          css`
            font-family: Cambria, Cochin, Georgia, Times, "Times New Roman",
              serif;
          `,
          css`
            font-family: Georgia, "Times New Roman", Times, serif;
          `,
          css`
            font-family: Impact, Haettenschweiler, "Arial Narrow Bold",
              sans-serif;
          `,
          css`
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          `,
          css`
            font-family: system-ui, -apple-system, BlinkMacSystemFont,
              "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
              "Helvetica Neue", sans-serif;
          `,
        ][fontFamily || 0]
      )}
    >
      {children}
    </div>
  );
};
