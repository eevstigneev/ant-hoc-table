import React, {FC, HTMLProps, ReactElement} from 'react';
import {SearchProps} from 'antd/lib/input';
import {ButtonProps} from 'antd/lib/button';
import styled from '@emotion/styled';
import {Button, Input} from 'antd';
import {PlusOutlined} from '@ant-design/icons/lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import {PanelRender} from 'rc-table/lib/interface';

const TSearchBox = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TSearchInput = styled(Input.Search)`
  width: 370px;
`;

const TCaption = styled.div`
  font-size: 18px;
  color: #3d3d3d;
  align-self: center;
  flex: 1 65%;
  min-height: 32px;
`;

const Th = styled.th`
  font-size: 12px;
  padding-top: 11px !important;
  padding-bottom: 8px !important;
  &[colspan] {
    font-size: 14px;
    font-weight: normal;
    line-height: 1.71;
    text-transform: uppercase;
    color: #3d3d3d;
    background: transparent;
  }
`;

const Td = styled.td`
  font-size: 12px;
  vertical-align: middle;
  &[rowspan] {
    vertical-align: top;
  }
  &[rowspan]:last-of-type {
    border-right: 1px solid #f0f0f0;
  }
`;

export type TRowProps = HTMLProps<HTMLTableRowElement>;
export type TBodyProps = HTMLProps<HTMLTableSectionElement>;
export type TCellProps = HTMLProps<HTMLTableCellElement>;
export type THeaderCellProps = HTMLProps<HTMLTableHeaderCellElement>;

export const TRow: FC<TRowProps> = props => <tr {...props} />;
export const TBody: FC<TBodyProps> = props => <tbody {...props} />;
export const TCell = <P,>(props: P & TCellProps): ReactElement => {
  const {children, colSpan, rowSpan, width, className, id, style} = props;
  const restProps = {colSpan, rowSpan, width, className, id, style};
  return <Td {...restProps}>{children}</Td>;
};

export const THeaderCell: FC<THeaderCellProps> = ({as, ...restProps}) => <Th {...restProps} />;
export const TSearch: FC<SearchProps> = props => {
  const {children, ...restProps} = props;
  return (
    <TSearchBox>
      <TCaption>{children}</TCaption>
      <TSearchInput {...restProps} />
    </TSearchBox>
  );
};

export const TAddRow: FC<ButtonProps> = ({children, ...restProps}) => {
  return (
    <>
      {children}
      <Button icon={<PlusOutlined />} {...restProps} />
    </>
  );
};
TAddRow.defaultProps = {
  type: 'link',
  title: 'Добавить строку',
};

export const TitleWith = <TRecord, TProps>(
  title: PanelRender<TRecord> | string | boolean | undefined,
  Component: FC<TProps>,
  componentProps: TProps,
): PanelRender<TRecord> => {
  const Title = typeof title === 'function' ? title : () => <>{title}</>;
  return (data: TRecord[]) => <Component {...componentProps}>{Title(data)}</Component>;
};
