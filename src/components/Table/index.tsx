import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@material-ui/core";
import { IColumn } from "../../interfaces/global.interface";

interface ITableProps {
  columns: IColumn[]
  tableData: any[]
  loading?: boolean
  onRowClick?: (row: any) => void
}

const CommonTable: React.FC<ITableProps> = ({
  columns,
  tableData,
  onRowClick,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column: IColumn, key: number) => (
              <TableCell key={key} align="left">
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
              {columns.map((column: IColumn, columnKey: number) => (
                <TableCell key={columnKey} align="left">
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
