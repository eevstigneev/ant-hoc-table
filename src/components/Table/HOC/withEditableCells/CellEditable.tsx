import React, {ReactElement, useMemo} from 'react';
import {Form, Input, Select} from 'antd';
import styled from '@emotion/styled';
import {TCell} from '../../TableParts';
import {TCellAllProps, TFieldProps} from './helpers';

const FormItem = styled(Form.Item)`
  margin: 0;
  label {
    display: none;
  }
`;

const FieldSelect = <TRecord extends Record<string, unknown>>(props: TFieldProps<TRecord>) => {
  const {record, enums = [], title: fieldLabel, dataIndex} = props;
  const options = useMemo(() => {
    if (record?.id && record?.title) {
      const {id, title} = record;
      const hasSelectedValue = enums.filter(({id: enumId}) => id === enumId).shift();
      if (!hasSelectedValue && (typeof id === 'string' || typeof id === 'number') && typeof title === 'string') {
        enums.push({id, title});
      }
    }
    return !enums ? [] : enums.map(({id: value, title: label}) => ({label, value}));
  }, [enums, record]);

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

const Field = <TRecord extends Record<string, unknown>>(props: TFieldProps<TRecord>) => {
  const {fieldType, enums} = props;
  switch (fieldType) {
    case 'string':
      return <FieldString<TRecord> {...props} />;
    case 'select':
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
    <TCell<TCellAllProps<TRecord>> {...restProps}>{editing ? <Field<TRecord> {...fieldProps} /> : children}</TCell>
  );
};

export default CellEditable;
