import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@material-ui/core";

interface ITableProps {
  columns: any[]
  tableData: any[]
  loading?: boolean
  onRowClick?: (id: string) => void
}

const CommonTable: React.FC<ITableProps> = ({
  columns,
  tableData,
  onRowClick = () => {},
}) => {

  const handleRowClick = (id: string): void => {
    onRowClick(id);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column: any, key: number) => (
              <TableCell key={key} align="left">
                {column.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData && tableData.map((row: any, key: number) => (
            <TableRow key={key} onClick={() => handleRowClick(row.id)}>
              {columns.map((column: any, columnKey: number) => (
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
