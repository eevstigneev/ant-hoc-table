import React, {FC, useCallback, useMemo, useState} from 'react';
import {Button, Form, Popconfirm} from 'antd';
import {CloseSquareOutlined, EditOutlined, QuestionCircleOutlined, SaveOutlined} from '@ant-design/icons/lib';
import {getDisplayName, MaybeIdOrIndex, TWithTable, mergeTableParts} from '../helpers';
import {columnsWithOnCell, TDictionary, TDictionaryItem} from './helpers';
import CellEditable from './CellEditable';

const editableComponents = {body: {cell: CellEditable}};

// replace to id if exist
const values2Id = <TRecord,>(record: TRecord): TRecord =>
  Object.entries(record).reduce(
    (acc, [key, value]: [string, MaybeIdOrIndex]) => ({
      ...acc,
      [key]: value?.id || value,
    }),
    record,
  );

// replace to title if exist
const ids2Values = <TRecord extends MaybeIdOrIndex, D extends TDictionary<TRecord>>(dictionary: D) => (
  values: TRecord,
): TRecord => {
  if (!dictionary) return values;
  return Object.entries(values).reduce((acc, [key, value]) => {
    if (key in dictionary && dictionary[key]) {
      const valueById = dictionary[key].filter((item: TDictionaryItem) => item.id === value).pop();
      if (valueById && 'title' in valueById) {
        return {...acc, [key]: valueById.title};
      }
      return {...acc, [key]: value};
    }
    return {...acc, [key]: value};
  }, values);
};

function withEditableCells<TRecord extends MaybeIdOrIndex = MaybeIdOrIndex>(
  TableComponent: FC<TWithTable<TRecord>>,
): FC<TWithTable<TRecord>> {
  function TableEditable(props: TWithTable<TRecord>) {
    const {dataSource = []} = props;
    const {onSave, dictionary, columns = [], components, ...restProps} = props;

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<string | number>('');
    const inDictionary = useMemo(() => dictionary && ids2Values<TRecord, TDictionary<TRecord>>(dictionary), [
      dictionary,
    ]);
    const id2ValAtDictionary = useCallback(values => (inDictionary ? inDictionary(values) : values), [inDictionary]);

    const isEditing = useCallback(record => record?.index === editingKey, [editingKey]);
    const mergeColumns = useMemo(
      () => columnsWithOnCell<TRecord>({dictionary, isEditing}),
      [dictionary, isEditing],
    );

    const setEditState = useCallback(
      (record?: TRecord) => {
        if (!record) return setEditingKey('');
        const {index, ...restRecord} = record;
        if (restRecord) form.setFieldsValue(values2Id<TRecord>(record));
        return index || index === 0 ? setEditingKey(index) : null;
      },
      [setEditingKey, form],
    );

    const handleSave = useCallback(
      async (record: TRecord) => {
        const newData = [...dataSource];
        const formData = (await form.validateFields()) as TRecord;
        const idx = newData.findIndex(({index}) => record.index === index);
        const item = newData[idx];
        setEditingKey('');
        if (!item) return;
        newData.splice(idx, 1, {...item, ...id2ValAtDictionary(formData)});
        const {index, ...restRecord} = item;
        if (onSave) onSave({...restRecord, ...formData}, newData);
      },
      [dataSource, form, id2ValAtDictionary, onSave],
    );

    const mergedColumns = useMemo(() => {
      const cols = mergeColumns(columns);
      return [
        ...cols,
        {
          key: 'save',
          width: '100px',
          render: (record: TRecord) => {
            const isEdit = isEditing(record);
            const {memberId} = record as {memberId?: string | null};
            if (memberId) return null;
            return isEdit ? (
              <>
                <Popconfirm
                  title="Вы уверены"
                  okText="Да"
                  cancelText="Нет"
                  icon={<QuestionCircleOutlined style={{color: 'red'}} />}
                  onConfirm={() => handleSave(record)}
                  onCancel={() => setEditState()}
                >
                  <Button type="link" icon={<SaveOutlined />} />
                </Popconfirm>
                <Button type="link" onClick={() => setEditState()} icon={<CloseSquareOutlined />} />
              </>
            ) : (
              <Button disabled={isEdit} type="link" onClick={() => setEditState(record)} icon={<EditOutlined />} />
            );
          },
        },
      ];
    }, [columns, isEditing, mergeColumns, handleSave, setEditState]);

    const tableParts = useMemo(() => mergeTableParts<TRecord>(components, editableComponents), [components]);

    return (
      <Form form={form} component={false}>
        <TableComponent {...restProps} columns={mergedColumns} components={tableParts} />
      </Form>
    );
  }

  TableEditable.displayName = `withEditableCells(${getDisplayName(TableComponent)})`;

  return TableEditable;
}

export default withEditableCells;
