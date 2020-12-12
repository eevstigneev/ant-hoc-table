import React, {FC, HTMLProps, ReactElement} from 'react';
import {SearchProps} from 'antd/lib/input';
import {ButtonProps} from 'antd/lib/button';
import styled from '@emotion/styled';
import {Button, Input} from 'antd';
import {PlusOutlined} from '@ant-design/icons/lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import {PanelRender} from 'rc-table/lib/interface';

const TableSearchWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TableSearchField = styled(Input.Search)`
  width: 370px;
`;

const TableSearchLabel = styled.div`
  font-size: 18px;
  color: #3d3d3d;
  align-self: center;
  flex: 1 65%;
  min-height: 32px;
`;

export const TableWrapper = styled.section`
  margin: 30px 0;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 12px 18px 0 rgba(0, 0, 0, 0.15);
`;

const TableHead = styled.th`
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

const TableData = styled.td`
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

export const TableRow: FC<TRowProps> = props => <tr {...props} />;
export const TableBody: FC<TBodyProps> = props => <tbody {...props} />;
export const TableCell = <P,>(props: P & TCellProps): ReactElement => {
  const {children, colSpan, rowSpan, width, className, id, style} = props;
  const restProps = {colSpan, rowSpan, width, className, id, style};
  return <TableData {...restProps}>{children}</TableData>;
};

export const TableHeadCell: FC<THeaderCellProps> = ({as, ...restProps}) => <TableHead {...restProps} />;
export const TableSearch: FC<SearchProps> = props => {
  const {children, ...restProps} = props;
  return (
    <TableSearchWrapper>
      <TableSearchLabel>{children}</TableSearchLabel>
      <TableSearchField {...restProps} />
    </TableSearchWrapper>
  );
};

export const TableAddRowButton: FC<ButtonProps> = ({children, ...restProps}) => {
  return (
    <>
      {children}
      <Button icon={<PlusOutlined />} {...restProps} />
    </>
  );
};

TableAddRowButton.defaultProps = {
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
