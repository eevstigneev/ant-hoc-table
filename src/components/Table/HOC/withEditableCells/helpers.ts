import {ColumnGroupType, ColumnType} from 'antd/lib/table/interface';
import {HTMLAttributes} from 'react';

export type TDictionaryItem = {id: string; title: string};
export type TDictionary<TRecord> = Partial<Record<keyof TRecord, TDictionaryItem[]>>;
export type TisEditing<TRecord> = (record: TRecord) => boolean;

export type TOnCellReturnProps<TRecord> = Omit<HTMLAttributes<HTMLElement>, 'title'> &
  Partial<TColumn<TRecord>> & {
    record?: TRecord;
    editing?: boolean;
    enums?: TDictionary<TRecord>[keyof TColumn<TRecord>['dataIndex']];
  };

export type TOnCell<TRecord> = (data: TRecord, index?: number) => TOnCellReturnProps<TRecord>;

export type TColumn<TRecord> = Omit<ColumnType<TRecord>, 'onCell'> & {
  index?: string | number;
  fieldType?: 'string' | 'select';
  editable?: boolean;
  onCell?: TOnCell<TRecord>;
};

export type TCellAllProps<TRecord> = TColumn<TRecord> & TOnCellReturnProps<TRecord>;

export type TColumns<TRecord> = (Omit<ColumnGroupType<TRecord> | ColumnType<TRecord>, 'onCell'> & TColumn<TRecord>)[];

export type TCellExtraProps<TRecord> = Omit<TCellAllProps<TRecord>, keyof Omit<HTMLAttributes<HTMLElement>, 'title'>>;
export type TFieldProps<TRecord> = Pick<
  TCellExtraProps<TRecord>,
  'title' | 'dataIndex' | 'fieldType' | 'enums' | 'record'
>;
export type TOptions<TRecord> = {
  dictionary?: TDictionary<TRecord>;
  isEditing?: TisEditing<TRecord>;
};

type TColumnsWithOnCellReturn<TRecord> = (columns: TColumns<TRecord>) => TColumns<TRecord>;
export const columnsWithOnCell = <TRecord, TProps extends TOptions<TRecord> = TOptions<TRecord>>(
  props: TProps,
): TColumnsWithOnCellReturn<TRecord> => {
  const {dictionary = {}, isEditing} = props;

  return columns =>
    columns.map(col => {
      if (!col.editable) return col;
      const {fieldType = 'select', dataIndex, title} = col;
      return {
        ...col,
        onCell: (record: TRecord) => ({
          record,
          fieldType,
          dataIndex,
          title,
          editing: isEditing && isEditing(record),
          enums: typeof dataIndex === 'string' ? dictionary[dataIndex] : undefined,
        }),
      };
    });
};
