import React from 'react';
import ReactDOM from 'react-dom';
import {css, Global} from '@emotion/react';
import {ConfigProvider} from 'antd';
import ruRu from 'antd/es/locale/ru_RU';
import styled from '@emotion/styled';
import App from './components/App/App';

const flexBox = css`
  display: flex;
  width: inherit;
  min-height: 100vh;
  flex: 1 1 100%;
  flex-direction: row;
`;

const CenterBox = styled.div`
  margin: 0 auto;
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
`;
const Root = () => (
  <>
    <Global styles={globalStyles} />
    <ConfigProvider locale={ruRu}>
      <CenterBox>
        <App />
      </CenterBox>
    </ConfigProvider>
  </>
);

ReactDOM.render(<Root />, document.getElementById('root'));
