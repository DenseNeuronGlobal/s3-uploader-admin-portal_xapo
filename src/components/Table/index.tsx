import React from 'react';
import {TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Checkbox} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { IColumn } from "../../interfaces/global.interface";

const useStyles = makeStyles(() => createStyles({
  tableHead: {
    background: '#FAFAFA',
  },
  tableHeadCell: {
    color: '#16191F',
    fontWeight: "bold",
    lineHeight: "18px",
    padding: "15px 20px"
  },
  checkboxTableHeadCell: {
    width: 0,
    padding: "13px 10px"
  },
  tableCell: {
    color: '#16191F',
    lineHeight: "18px",
    padding: "15px 20px"
  },
  checkboxTableCell: {
    width: 0,
    padding: "4px 10px"
  }
}))

interface ITableProps {
  columns: IColumn[]
  tableData: any[]
  loading?: boolean
  onRowClick?: (row: any) => void
  showCheckBoxSelection?: boolean
  selectedRows?: string[]
  setSelectedRows?: (rowIds: string[]) => void
}

const CommonTable: React.FC<ITableProps> = ({
  columns,
  tableData,
  onRowClick,
  showCheckBoxSelection = false,
  selectedRows = [],
  setSelectedRows= () => {}
}) => {
  const classes = useStyles();

  const handleRowSelection = (id: string, isSelected: boolean): void => {
    const newSelectedRows = selectedRows.filter((rowId) => rowId !== id);
    if (!isSelected) {
      newSelectedRows.push(id);
    }
    setSelectedRows(newSelectedRows);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead className={classes.tableHead}>
          <TableRow>
            {showCheckBoxSelection && (
                <TableCell
                    align="left"
                    className={classes.checkboxTableHeadCell}
                />
            )}
            {columns.map((column: IColumn, key: number) => (
              <TableCell
                  key={key}
                  align="left"
                  className={classes.tableHeadCell}
              >
                {column.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData && tableData.map((row: any, key: number) => (
            <TableRow
              key={key}
              hover={!!onRowClick}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {showCheckBoxSelection && (
                  <TableCell
                      align="left"
                      className={classes.checkboxTableCell}
                  >
                    <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelection(row.id, selectedRows.includes(row.id))}
                    />
                  </TableCell>
              )}
              {columns.map((column: IColumn, columnKey: number) => (
                <TableCell
                    key={columnKey}
                    align="left"
                    className={classes.tableCell}
                >
                  {column.render
                    ? column.render(row)
                    : `${row[column.key]}`
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export default CommonTable;
