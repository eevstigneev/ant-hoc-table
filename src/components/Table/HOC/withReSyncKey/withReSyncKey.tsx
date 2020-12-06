import React, {FC, useMemo} from 'react';
import {Button, Popconfirm} from 'antd';
import {QuestionCircleOutlined, SyncOutlined} from '@ant-design/icons/lib';
import {getDisplayName, TWithTable} from '../helpers';

export function withReSyncKey<TRecord>(TableComponent: FC<TWithTable<TRecord>>): FC<TWithTable<TRecord>> {
  function TableWithReSyncKey(props: TWithTable<TRecord>) {
    const {columns = [], onReSyncKey, ...restProps} = props;
    const mergedColumns = useMemo(() => {
      if (!onReSyncKey) {
        return columns;
      }

      return [
        ...columns,
        {
          key: 'reset',
          width: '55px',
          render: (record: TRecord) => (
            <Popconfirm
              title="Вы уверены"
              okText="Да"
              cancelText="Нет"
              icon={<QuestionCircleOutlined style={{color: 'red'}} />}
              onConfirm={() => onReSyncKey(record)}
            >
              <Button type="link" icon={<SyncOutlined />} />
            </Popconfirm>
          ),
        },
      ];
    }, [columns, onReSyncKey]);

    return <TableComponent {...restProps} columns={mergedColumns} />;
  }

  TableWithReSyncKey.displayName = `withReSyncKey(${getDisplayName(TableComponent)})`;

  return TableWithReSyncKey;
}
export default withReSyncKey;
