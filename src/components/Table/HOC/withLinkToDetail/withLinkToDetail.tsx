import React, {FC, useMemo} from 'react';
import {Button} from 'antd';
import {EditOutlined} from '@ant-design/icons/lib';
import {getDisplayName, TWithTable} from '../helpers';

export function withLinkToDetail<TRecord>(TableComponent: FC<TWithTable<TRecord>>): FC<TWithTable<TRecord>> {
  function TableWithLinkToEdit(props: TWithTable<TRecord>) {
    const {columns = [], onLink, ...restProps} = props;
    const mergedColumns = useMemo(() => {
      if (!onLink) {
        return columns;
      }

      return [
        ...columns,
        {
          key: 'onLink',
          width: '40px',
          render: (record: TRecord) => <Button type="link" icon={<EditOutlined />} onClick={() => onLink(record)} />,
        },
      ];
    }, [columns, onLink]);

    return <TableComponent {...restProps} columns={mergedColumns} />;
  }

  TableWithLinkToEdit.displayName = `withLinkToDetail(${getDisplayName(TableComponent)})`;

  return TableWithLinkToEdit;
}
export default withLinkToDetail;
