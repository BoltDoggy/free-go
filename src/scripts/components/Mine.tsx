import { h } from "preact";
import styled from 'styled-components';

const MineWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background: red;
`;

export default () => {
  return <MineWrapper>我的</MineWrapper>;
};
