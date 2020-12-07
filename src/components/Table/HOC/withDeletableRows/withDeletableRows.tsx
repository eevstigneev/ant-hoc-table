import React, {FC, useCallback, useMemo} from 'react';
import {Button, Popconfirm} from 'antd';
import {DeleteOutlined, QuestionCircleOutlined} from '@ant-design/icons/lib';
import styled from '@emotion/styled';
import {getDisplayName, MaybeIdOrIndex, TWithTable} from '../helpers';

const QuestionCircleOutlinedStyled = styled(QuestionCircleOutlined)`
  color: red;
`;

function withDeletableRows<TRecord>(TableComponent: FC<TWithTable<TRecord>>): FC<TWithTable<TRecord>> {
  function TableDeletable(props: TWithTable<TRecord>) {
    const {dataSource = []} = props;
    const {onDelete, columns = [], ...restProps} = props;

    const handleDeleteRow = useCallback(
      (record: TRecord & MaybeIdOrIndex) => {
        if (!record) return;
        const removedRow = record;
        const newData = [...dataSource];
        const index = newData.findIndex((item: MaybeIdOrIndex) => {
          if (record?.id) return record.id === item.id;
          return record.index === item.index;
        });
        if (index === -1) return;
        newData.splice(index, 1);
        if (onDelete) onDelete(removedRow, newData);
      },
      [dataSource, onDelete],
    );

    const mergedColumns = useMemo(() => {
      return [
        ...columns,
        {
          width: '55px',
          render: (record: TRecord) => (
            <Popconfirm
              title="Вы уверены"
              okText="Да"
              cancelText="Нет"
              icon={<QuestionCircleOutlinedStyled />}
              onConfirm={() => handleDeleteRow(record)}
            >
              <Button type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          ),
        },
      ];
    }, [columns, handleDeleteRow]);

    return <TableComponent {...restProps} dataSource={dataSource} columns={mergedColumns} />;
  }

  TableDeletable.displayName = `withDeletableRows(${getDisplayName(TableComponent)})`;

  return TableDeletable;
}

export default withDeletableRows;
