import React, {FC, useCallback, useMemo, useState} from 'react';
import {Button, Form, Popconfirm} from 'antd';
import {CloseSquareOutlined, EditOutlined, QuestionCircleOutlined, SaveOutlined} from '@ant-design/icons/lib';
import {getDisplayName, TWithTable, mergeTableParts} from '../helpers';
import {columnsWithOnCell, TDictionary, TDictionaryItem} from './helpers';
import CellEditable from './CellEditable';

const editableComponents = {body: {cell: CellEditable}};

// replace id to title from dictionary if exist
const ids2Values = <TRecord extends Record<string, unknown>, D extends TDictionary<TRecord>>(dictionary: D) => (
  values: TRecord,
): TRecord => {
  if (!dictionary) return values;
  return Object.entries(values).reduce((acc, [key, value]) => {
    const dictionaryFieldValues = key in dictionary && Array.isArray(dictionary[key]) ? dictionary[key] : null;
    if (!dictionaryFieldValues) {
      // has not dictionary for cell, skip;
      return {...acc, [key]: value};
    }
    const valueById = (dictionary[key] || []).filter((item: TDictionaryItem) => item?.id === value).pop();
    return {...acc, [key]: valueById?.title || value};
  }, values);
};

function withEditableCells<TRecord extends Record<string, unknown>>(
  TableComponent: FC<TWithTable<TRecord>>,
): FC<TWithTable<TRecord>> {
  function TableEditable(props: TWithTable<TRecord>) {
    const {dataSource = []} = props;
    const {onSaveRowData, dictionary, columns = [], components, ...restProps} = props;

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<string | number>('');
    const inDictionary = useMemo(() => dictionary && ids2Values<Partial<TRecord>, TDictionary<TRecord>>(dictionary), [
      dictionary,
    ]);
    const id2ValAtDictionary = useCallback(
      (values: Partial<TRecord>) => (inDictionary ? inDictionary(values) : values),
      [inDictionary],
    );

    const isEditing = useCallback(record => record?.index === editingKey, [editingKey]);
    const mergeColumns = useMemo(
      () => columnsWithOnCell<TRecord>({dictionary, isEditing}),
      [dictionary, isEditing],
    );

    const setEditState = useCallback(
      (record?: Partial<TRecord>) => {
        if (!record) return setEditingKey('');
        const {index, ...restRecord} = record;
        if (restRecord) form.setFieldsValue(record);
        if (typeof index !== 'string' && typeof index !== 'number') {
          return null;
        }
        return index || index === 0 ? setEditingKey(index) : null;
      },
      [setEditingKey, form],
    );

    const handleSave = useCallback(
      async (record: Partial<TRecord>) => {
        const newData = [...dataSource];
        const formData = (await form.validateFields()) as Partial<TRecord>;
        const idx = newData.findIndex(({index}) => record.index === index);
        const item = newData[idx];
        setEditingKey('');
        if (!item) return;
        newData.splice(idx, 1, {...item, ...id2ValAtDictionary(formData)});
        const {index, ...restRecord} = item;
        if (onSaveRowData) onSaveRowData({...restRecord, ...formData}, newData);
      },
      [dataSource, form, id2ValAtDictionary, onSaveRowData],
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
      <Form<Partial<TRecord>> form={form} component={false}>
        <TableComponent {...restProps} columns={mergedColumns} components={tableParts} />
      </Form>
    );
  }

  TableEditable.displayName = `withEditableCells(${getDisplayName(TableComponent)})`;

  return TableEditable;
}

export default withEditableCells;
