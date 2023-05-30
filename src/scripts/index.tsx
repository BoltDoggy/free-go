import { h, render } from "npm:preact";
import { css } from "npm:@emotion/css";
// @deno-types="../mdx/any.d.ts"
import Home from "../mdx/home.mdx";
import StyledContent from "../components/styled-content.tsx";

const app = document.getElementById("app");
app &&
  render(
    <StyledContent fontFamily={0}>
      <Home></Home>
    </StyledContent>,
    app
  );
