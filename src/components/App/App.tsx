import React, {FC, useCallback, useMemo, useState} from 'react';
import {withTable} from '../Table';
import {TOnAddRow, TOnDelete, TOnSave, TOnSearch, TOnSort, uniq} from '../Table/HOC/helpers';
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

type TRecord = Partial<typeof data[0]>;

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
  // initValues for editable cells
  const [initialValues] = useState<Partial<TRecord>>({title: '', address: '', age: undefined, sex: undefined});
  // dictionary for select
  const dictionary = useMemo(() => {
    return {
      sex: [
        {id: 2, title: 'female'},
        {id: 1, title: 'male'},
      ],
    };
  }, []);

  const handleAddRow = useCallback<TOnAddRow<TRecord>>(records => setList(records), [setList]);
  const handleDeleteRow = useCallback<TOnDelete<TRecord>>((_record, records) => setList(records), [setList]);
  const handleDraggableSort = useCallback<TOnSort<TRecord>>((_target, _before, records) => setList(records), [setList]);
  const handleSearch = useCallback<TOnSearch<TRecord>>((records, value) => (value ? setList(records) : setList(data)), [
    setList,
  ]);

  const handleSaveRowData = useCallback<TOnSave<TRecord>>(
    (record, records) => {
      if (record?.id) return setList(records);
      const newList = records.map(item => {
        // mock request, data should be received with id
        return item?.id ? item : {...item, id: uniq()};
      });
      return setList(newList);
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
      initialValues={initialValues}
      onAddRow={handleAddRow}
      onDelete={handleDeleteRow}
      onSave={handleSaveRowData}
      onSort={handleDraggableSort}
      onSearch={handleSearch}
    />
  );
};

export default App;
