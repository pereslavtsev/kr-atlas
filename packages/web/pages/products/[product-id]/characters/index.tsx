import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import useAppQuery from '../../../../use-app-query';
import CharactersQuery from '../../../../graphql/queries/characters/characters-query.graphql';
import { Column, useTable } from 'react-table';
import { Button, ButtonGroup } from '@blueprintjs/core';
import Link from 'next/link';

const Characters: NextPage<any> = () => {
  const { data, error, refetch } = useAppQuery(CharactersQuery);
  const router = useRouter();
  const columns = React.useMemo<Column[]>(
    () => [
      {
        Header: 'ID',
        accessor: 'node.id',
      },
      {
        Header: 'Name',
        accessor: 'node.name',
        Cell: ({ row, value }: any) => (
          <>
            <Link
              href={{
                pathname: '/products/[product-id]/characters/[character-id]',
                query: {
                  ...router.query,
                  'character-id': row.original.node.id,
                },
              }}
            >
              <a>{value}</a>
            </Link>
          </>
        ),
      },
    ],
    [router.query],
  );
  const tableInstance = useTable({
    columns,
    data: data?.characters.edges ?? [],
  });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  console.log('data', data, error);
  return (
    <>
      <h1 className="bp4-heading">Characters</h1>
      <table
        className="bp4-html-table bp4-html-table-bordered bp4-html-table-striped"
        {...getTableProps()}
        style={{ width: '100%' }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                // onClick={(event) =>
                //   router.push(`/continents/${row.values['node.id']}`)
                // }
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <ButtonGroup minimal>
        <Button
          icon="caret-left"
          onClick={async () => {
            const before = data?.characters.edges[0].cursor;
            await refetch({ last: 10, before, first: null, after: null });
          }}
        >
          Prev
        </Button>
        <Button
          rightIcon="caret-right"
          onClick={async () => {
            const after =
              data?.characters.edges[data.characters.edges.length - 1].cursor;
            await refetch({ first: 10, after, last: null, before: null });
          }}
        >
          Next
        </Button>
      </ButtonGroup>
    </>
  );
};

export default Characters;
