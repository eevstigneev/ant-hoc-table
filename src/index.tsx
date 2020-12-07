import React from 'react';
import ReactDOM from 'react-dom';
import {css, Global} from '@emotion/react';
import {ConfigProvider} from 'antd';
import ruRu from 'antd/es/locale/ru_RU';
import styled from '@emotion/styled';
import App from './components/App/App';
import {fluidStyles} from './styles';

const flexBox = css`
  display: flex;
  width: inherit;
  min-height: 100vh;
  flex: 1 1 100%;
  flex-direction: row;
`;

const FluidBox = styled.div`
  ${fluidStyles}
  width: 100%;
  height: inherit;
`;

const globalStyles = css`
  body {
    height: initial;
    min-height: 100%;
  }
  #root {
    background: #f0f2f5;
    ${flexBox}
  }
  .row-dragging {
    background: #fafafa;
    border: 1px solid #ccc;
  }

  .row-dragging td {
    padding: 16px;
    visibility: hidden;
  }

  .row-dragging .drag-visible {
    visibility: visible;
  }
`;
const Root = () => (
  <>
    <Global styles={globalStyles} />
    <ConfigProvider locale={ruRu}>
      <FluidBox>
        <App />
      </FluidBox>
    </ConfigProvider>
  </>
);

ReactDOM.render(<Root />, document.getElementById('root'));
