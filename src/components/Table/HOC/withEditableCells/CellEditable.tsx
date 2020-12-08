import React, {ReactElement, useMemo} from 'react';
import {Form, Input, InputNumber, Select} from 'antd';
import styled from '@emotion/styled';
import {TableCell} from '../../TableParts';
import {TCellAllProps, TFieldProps} from './helpers';
import {EFieldTypesSupported} from '../constants';

const FormItem = styled(Form.Item)`
  margin: 0;
  label {
    display: none;
  }
`;

const FieldSelect = <TRecord extends Record<string, unknown>>(props: TFieldProps<TRecord>) => {
  const {record = {}, enums = [], title: fieldLabel, dataIndex} = props;
  const options = useMemo(() => {
    const key = typeof dataIndex === 'string' || typeof dataIndex === 'number' ? dataIndex : null;
    if (key && key in record && record[key]?.id && record[key]?.title) {
      const {id, title} = record[key];
      const hasSelectedValue = enums.filter(({id: enumId}) => id === enumId).shift();
      if (!hasSelectedValue && typeof title === 'string' && (typeof id === 'string' || typeof id === 'number')) {
        enums.push({id, title});
      }
    }
    return !enums ? [] : enums.map(({id: value, title: label}) => ({label, value}));
  }, [enums, record, dataIndex]);

  return (
    <FormItem label={fieldLabel} name={dataIndex} rules={[{required: true}]}>
      <Select options={options} />
    </FormItem>
  );
};

const FieldString = <TRecord extends Record<string, unknown>>(props: TFieldProps<TRecord>) => {
  const {title, dataIndex} = props;
  return (
    <FormItem label={title} name={dataIndex} rules={[{required: true}]}>
      <Input />
    </FormItem>
  );
};

const FieldNumber = <TRecord extends Record<string, unknown>>(props: TFieldProps<TRecord>) => {
  const {title, dataIndex} = props;
  return (
    <FormItem label={title} name={dataIndex} rules={[{required: true}]}>
      <InputNumber />
    </FormItem>
  );
};

const Field = <TRecord extends Record<string, unknown>>(props: TFieldProps<TRecord>) => {
  const {fieldType, enums} = props;
  switch (fieldType) {
    case EFieldTypesSupported.string:
      return <FieldString<TRecord> {...props} />;
    case EFieldTypesSupported.number:
      return <FieldNumber<TRecord> {...props} />;
    case EFieldTypesSupported.select:
      return enums ? <FieldSelect<TRecord> {...props} /> : null;
    default:
      return null;
  }
};

const CellEditable = <TRecord extends Record<string, unknown>>(
  props: TCellAllProps<TRecord>,
): ReactElement<TCellAllProps<TRecord>> => {
  const {editing, dataIndex, title, enums, fieldType, record, index, children, ...restProps} = props;
  const fieldProps = {title, dataIndex, enums, fieldType, record};
  return (
    <TableCell<TCellAllProps<TRecord>> {...restProps}>
      {editing ? <Field<TRecord> {...fieldProps} /> : children}
    </TableCell>
  );
};

export default CellEditable;
