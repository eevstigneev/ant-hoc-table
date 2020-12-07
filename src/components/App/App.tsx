import React, {FC, useCallback, useState} from 'react';
import {withTable} from '../Table';
import {uniq} from '../Table/HOC/helpers';

const columns = [
  {
    title: 'Name',
    dataIndex: 'title',
    editable: true, // make field editable
    fieldType: 'string', // support types 'string' | 'select'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    editable: true, // make field editable
    fieldType: 'string', // support types 'string' | 'select'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    editable: true, // make field editable
    fieldType: 'string', // support types 'string' | 'select'
  },
];

const data = [
  {
    index: '1', // required
    id: 'cf5b4cc5-485f-47d4-9997-e5e5e37bfc16', // required
    title: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    index: '2', // required
    id: 'd5ec4e95-12d4-4573-a2cc-d9ab10f0c966', // required
    title: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    index: '3', // required
    id: '5fa8812d-646d-4bca-bc5a-fcbd173c7685', // required
    title: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];

type TRecord = typeof data[0];

const Table = withTable<TRecord>({
  withAddableRows: true,
  withDeletableRows: true,
  withDraggableSortRows: true,
  withEditableCells: true,
  withSearchByTitle: true,
});

const App: FC = () => {
  const [list, setList] = useState<TRecord[]>(data);

  const handleAddRow = useCallback(records => setList(records), [setList]);
  const handleDeleteRow = useCallback((_record, records) => setList(records), [setList]);
  const handleSaveRowData = useCallback(
    (record: TRecord, records: TRecord[]) => {
      if (record?.id) return setList(records);
      const newList = [...list].filter(({id}) => !!id);
      return setList([{...record, index: uniq(), id: uniq()}, ...newList]);
    },
    [list, setList],
  );

  const handleDraggableSort = useCallback(
    (_target: TRecord | null, _before: TRecord | null, records: TRecord[]) => setList(records),
    [setList],
  );

  const handleSearch = useCallback(
    (records: TRecord[], value: string) => {
      return value ? setList(records) : setList(data);
    },
    [setList],
  );

  return (
    <Table
      title={() => 'HOC table'}
      rowKey="index"
      dataSource={list}
      columns={columns}
      initialValues={{title: '', address: '', age: 0}}
      onAddRow={handleAddRow}
      onDelete={handleDeleteRow}
      onSave={handleSaveRowData}
      onSort={handleDraggableSort}
      onSearch={handleSearch}
    />
  );
};

export default App;
