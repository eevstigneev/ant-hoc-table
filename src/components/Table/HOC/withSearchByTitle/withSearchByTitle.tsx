import React, {FC, useCallback, useMemo} from 'react';
import {SearchProps} from 'antd/lib/input';
import {getDisplayName, MaybeTitleOrFIO, TWithTable} from '../helpers';
import {TitleWith, TSearch} from '../../TableParts';

const searchNormalizer = (value: string): string => value.trim().toLowerCase().replace(/\s/g, '');
const composeRecordToText = (record: MaybeTitleOrFIO): string => {
  if (record?.title) return record?.title;
  if (record?.lastName || record?.firstName || record?.middleName) {
    const {firstName = '', lastName = '', middleName = ''} = record;
    return [lastName, firstName, middleName].filter(Boolean).join('');
  }
  return '';
};

type HandleSearch = Required<SearchProps>['onSearch'];

function withSearchByTitle<TRecord>(TableComponent: FC<TWithTable<TRecord>>): FC<TWithTable<TRecord>> {
  function TableWithSearchByTitle(props: TWithTable<TRecord>) {
    const {dataSource = []} = props;
    const {title = '', onSearch, searchPlaceholder: placeholder, ...restProps} = props;

    const handleSearch = useCallback<HandleSearch>(
      value => {
        const searchText = searchNormalizer(value);
        const found = dataSource.filter((record: MaybeTitleOrFIO) => {
          const recordText = composeRecordToText(record);
          return searchNormalizer(recordText).includes(searchText);
        });
        if (onSearch) onSearch(found, searchText);
      },
      [dataSource, onSearch],
    );

    const TitleWithSearch = useMemo(
      () => TitleWith<TRecord, SearchProps>(title, TSearch, {onSearch: handleSearch, placeholder}),
      [title, placeholder, handleSearch],
    );

    return <TableComponent {...restProps} title={TitleWithSearch} />;
  }

  TableWithSearchByTitle.displayName = `withSearchByTitle(${getDisplayName(TableComponent)})`;
  return TableWithSearchByTitle;
}

export default withSearchByTitle;