import React from "react";
import { useSortBy, useTable } from "react-table";
import styled from "styled-components";
import "./App.css";
import heros from "./data/heros.json";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data
    },
    useSortBy
  );

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>Showing {rows.length} heros</div>
    </>
  );
}

function App() {
  const data = React.useMemo(() => heros, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Heros",
        columns: [
          {
            Header: "Name",
            accessor: "Hero"
          },
          {
            Header: "Role",
            accessor: "Role"
          },
          {
            Header: "AttackType",
            accessor: "AttackType"
          },
          {
            Header: "Power",
            accessor: "Power"
          },
          {
            Header: "Intelligence",
            accessor: "Intelligence"
          },
          {
            Header: "Agility",
            accessor: "Agility"
          },
          {
            Header: "Health",
            accessor: "Health"
          },
          {
            Header: "Armor",
            accessor: "Armor"
          },
          {
            Header: "Strength",
            accessor: "Strength"
          },
          {
            Header: "Magic attack",
            accessor: "MagicAttack"
          },
          {
            Header: "Physical attack",
            accessor: "PhysicalAttack"
          },
          {
            Header: "Magic defense",
            accessor: "MagicDefense"
          },
          {
            Header: "Armor penetration",
            accessor: "ArmorPenetration"
          },
          {
            Header: "Dodge",
            accessor: "Dodge"
          },
          {
            Header: "Critical hit chance",
            accessor: "CriticalHitChance"
          }
        ]
      }
    ],
    []
  );

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default App;
