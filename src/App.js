import { matchSorter } from "match-sorter";
import React from "react";
import ReactGA from "react-ga";
import { useFilters, useGlobalFilter, useSortBy, useTable } from "react-table";
import styled from "styled-components";
import "./App.css";
import heros from "./data/heros.json";

ReactGA.initialize("G-4V4PCD21W4");

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

// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  return (
    <input
      className="search-filter"
      value={filterValue || ""}
      onChange={e => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search`}
    />
  );
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function MinColumnFilter({ column: { filterValue = [], preFilteredRows, setFilter, id } }) {
  return (
    <div
      style={{
        display: "flex"
      }}>
      <input
        value={filterValue[0] || ""}
        type="number"
        onChange={e => {
          const val = e.target.value;
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
        }}
        placeholder={`Min`}
        style={{
          width: "70px",
          margin: "0.1rem"
        }}
      />
    </div>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val;

function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes
    },
    useFilters, // useFilters
    useGlobalFilter, // useGlobalFilter
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
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
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

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== "number";

function App() {
  ReactGA.pageview(window.location.pathname);

  const data = React.useMemo(() => heros, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Hero Wars - statistics",
        columns: [
          {
            Cell: row => {
              return (
                <div>
                  <img height={34} src={row["row"].original.Image} alt="hero" />
                </div>
              );
            },
            id: "image"
          },
          {
            Header: "Name",
            accessor: "Hero",
            filter: "fuzzyText"
          },
          {
            Header: "Role 👨‍⚕️",
            accessor: "Role",
            filter: "fuzzyText"
          },
          {
            Header: "Attack type 🔫🏹",
            accessor: "AttackType",
            filter: "fuzzyText"
          },
          {
            Header: "Power 🔋",
            accessor: "Power",
            Filter: MinColumnFilter,
            filter: "between"
          },
          {
            Header: "Intel 🧠",
            accessor: "Intelligence",
            Filter: MinColumnFilter,
            filter: "between"
          },
          {
            Header: "Agility 💨",
            accessor: "Agility",
            Filter: MinColumnFilter,
            filter: "between"
          },
          {
            Header: "Health 💊",
            accessor: "Health",
            Filter: MinColumnFilter,
            filter: "between"
          },
          {
            Header: "Armor 🛡️",
            accessor: "Armor",
            Filter: MinColumnFilter,
            filter: "between"
          },
          {
            Header: "Strength 💪",
            accessor: "Strength",
            Filter: MinColumnFilter,
            filter: "between"
          },
          {
            Header: "Physical attack",
            accessor: "PhysicalAttack",
            Filter: MinColumnFilter,
            filter: "between"
          },
          {
            Header: "Magic attack",
            accessor: "MagicAttack",
            Filter: MinColumnFilter,
            filter: "between"
          },
          {
            Header: "Magic defense",
            accessor: "MagicDefense",
            Filter: MinColumnFilter,
            filter: "between"
          },
          {
            Header: "🛡️ piercing",
            accessor: "ArmorPenetration",
            Filter: MinColumnFilter,
            filter: "between"
          },
          {
            Header: "Dodge 🦘",
            accessor: "Dodge",
            Filter: MinColumnFilter,
            filter: "between"
          },
          {
            Header: "Critical 🎯",
            accessor: "CriticalHitChance",
            Filter: MinColumnFilter,
            filter: "between"
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
