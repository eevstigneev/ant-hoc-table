import React, {FC, useCallback, useMemo, useState} from 'react';
import {withTable} from '../Table';
import {uniq} from '../Table/HOC/helpers';
import {EFieldTypesSupported} from '../Table/HOC/constants';
import {TColumns} from '../Table/HOC/withEditableCells/helpers';

const data = [
  {
    index: '1', // required
    id: 'cf5b4cc5-485f-47d4-9997-e5e5e37bfc16', // required
    title: 'John Brown',
    age: 32,
    sex: 'male',
    address: 'New York No. 1 Lake Park',
  },
  {
    index: '2', // required
    id: 'd5ec4e95-12d4-4573-a2cc-d9ab10f0c966', // required
    title: 'Jim Green',
    age: 42,
    sex: 'male',
    address: 'London No. 1 Lake Park',
  },
  {
    index: '3', // required
    id: '5fa8812d-646d-4bca-bc5a-fcbd173c7685', // required
    title: 'Joe Black',
    age: 32,
    sex: 'male',
    address: 'Sidney No. 1 Lake Park',
  },
];

type TRecord = typeof data[0];

const columns: TColumns<TRecord> = [
  {
    title: 'Name',
    dataIndex: 'title',
    editable: true, // make field editable
    fieldType: EFieldTypesSupported.string,
    className: 'drag-visible',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    editable: true, // make field editable
    fieldType: EFieldTypesSupported.number,
  },
  {
    title: 'Sex',
    dataIndex: 'sex',
    editable: true, // make field editable
    fieldType: EFieldTypesSupported.select,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    editable: true, // make field editable
    fieldType: EFieldTypesSupported.string,
  },
];

const Table = withTable<TRecord>({
  withAddableRows: true,
  withDeletableRows: true,
  withDraggableSortRows: true,
  withEditableCells: true,
  withSearchByTitle: true,
});

const App: FC = () => {
  const [list, setList] = useState<TRecord[]>(data);
  // dictionary for select
  const dictionary = useMemo(() => {
    return {
      sex: [
        {id: 2, title: 'female'},
        {id: 1, title: 'male'},
      ],
    };
  }, []);

  const handleAddRow = useCallback(records => setList(records), [setList]);
  const handleDeleteRow = useCallback((_record, records) => setList(records), [setList]);
  const handleSaveRowData = useCallback(
    (record: TRecord, records: TRecord[]) => {
      if (record?.id) return setList(records);
      const newList = records.map(item => {
        // mock request, data should be received with id
        return item?.id ? item : {...item, id: uniq()};
      });
      return setList(newList);
    },
    [setList],
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
      dictionary={dictionary}
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
