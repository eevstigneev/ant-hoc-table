import React, {FC, useMemo} from 'react';
import {Button} from 'antd';
import {EditOutlined} from '@ant-design/icons/lib';
import {getDisplayName, TWithTable} from '../helpers';

export function withLinkToDetail<TRecord>(TableComponent: FC<TWithTable<TRecord>>): FC<TWithTable<TRecord>> {
  function TableWithLinkToDetail(props: TWithTable<TRecord>) {
    const {columns = [], onLinkToDetail, ...restProps} = props;
    const mergedColumns = useMemo(() => {
      if (!onLinkToDetail) {
        return columns;
      }

      return [
        ...columns,
        {
          key: 'onLink',
          width: '40px',
          render: (record: TRecord) => (
            <Button type="link" icon={<EditOutlined />} onClick={() => onLinkToDetail(record)} />
          ),
        },
      ];
    }, [columns, onLinkToDetail]);

    return <TableComponent {...restProps} columns={mergedColumns} />;
  }

  TableWithLinkToDetail.displayName = `withLinkToDetail(${getDisplayName(TableComponent)})`;

  return TableWithLinkToDetail;
}
export default withLinkToDetail;
