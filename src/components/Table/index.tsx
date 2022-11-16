import React, {useState, ChangeEvent, useEffect} from 'react';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Checkbox,
    TablePagination,
    Box,
    styled,
    Popover
} from '@material-ui/core';
import {IColumn} from '../../interfaces/global.interface';
import {MoreVert} from "@material-ui/icons";

const TableHeadColumn: any = styled(TableHead)({
    background: '#FAFAFA'
});

const CheckboxTableHeadCell: any = styled(TableCell)({
    width: 0,
    padding: '13px 10px'
});

const TableHeadCell: any = styled(TableCell)({
    color: '#16191F',
    fontWeight: 'bold',
    lineHeight: '18px',
    padding: '15px 20px',

    // @ts-ignore
    '&:hover': {
        '& .MuiBox-root': {
            '& .MuiSvgIcon-root': {
                visibility: 'visible !important'
            }
        }
    }
});

const CheckboxTableBodyCell: any = styled(TableCell)({
    width: 0,
    padding: '4px 10px'
});

const TableBodyCell: any = styled(TableCell)({
    color: '#16191F',
    lineHeight: '18px',
    padding: '15px 20px'
});

const HeaderLabel: any = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
});

const Options: any = styled(MoreVert)({
    height: '18px',
    cursor: 'pointer'
});

const MenuContent: any = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    background: '#783326',
    width: '200px'
}));

const DropdownOption: any = styled(Box)({
    width: '-webkit-fill-available',
    lineHeight: '22px',
    padding: '9px 20px',
    fontSize: '14px',
    color: '#ffffff',
    border: '1px solid #414750',
    borderRadius: 0,
    cursor: 'pointer'
});

const TableFooter: any = styled(Box)({
    display: 'flex',
    justifyContent: 'flex-end',
    background: '#fff',
    boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
});

interface ITableProps {
  tableColumns: IColumn[];
  tableData: any[];
  loading?: boolean;
  rowKey?: string;
  onRowClick?: (row: any) => void;
  showCheckBoxSelection?: boolean;
  selectedRows?: string[];
  setSelectedRows?: (rowIds: string[]) => void;
}

const CommonTable: React.FC<ITableProps> = ({
  tableColumns,
  tableData,
  onRowClick,
  rowKey = 'id',
  showCheckBoxSelection = false,
  selectedRows = [],
  setSelectedRows = () => {}
}) => {
  const [columns, setColumns] = useState<IColumn[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleRowSelection = (id: string, isSelected: boolean): void => {
    const newSelectedRows = selectedRows.filter(rowId => rowId !== id);
    if (!isSelected) {
      newSelectedRows.push(id);
    }
    setSelectedRows(newSelectedRows);
  };

  const handlePageChange = (e: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
  };

  const handleRowsPerPageChange = (e: ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+e.target.value);
      setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, key: string) => {
      setSelectedColumn(key);
      setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
      setSelectedColumn('');
      setAnchorEl(null);
  };

  const hideColumn = () => {
      setHiddenColumns((prev) => ([...prev, selectedColumn]))
      setColumns((prev) => prev.map((column) => ({
          ...column,
          hideColumn: selectedColumn === column.key || column.hideColumn
      })));
      handleMenuClose();
  };

  const showAllColumns = () => {
      setHiddenColumns([]);
      setColumns((prev) => prev.map((column) => ({
          ...column,
          hideColumn: false
      })));
      handleMenuClose();
  };

  const initTable = () => {
      const updatedColumns = tableColumns.map((column) => ({
          ...column,
          hideColumn: column.hideColumn !== undefined ? column.hideColumn : false
      }))
      setColumns(updatedColumns);
  };

  useEffect(() => {
      initTable();
  }, []);

  return (
      <>
        <TableContainer component={Paper}>
          <Table>
            <TableHeadColumn>
              <TableRow>
                {showCheckBoxSelection && <CheckboxTableHeadCell align="left" />}
                {columns
                    .filter((column: IColumn) => !column.hideColumn)
                    .map((column: IColumn, key: number) => (
                      <TableHeadCell key={key} align="left">
                          <HeaderLabel>
                              {column.title}
                              <Options
                                  fontSize={"small"}
                                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleMenuClick(e, column.key)}
                                  style={{ visibility: selectedColumn === column.key ? 'visible' : 'hidden' }}
                              />
                          </HeaderLabel>
                      </TableHeadCell>
                    ))
                }
              </TableRow>
            </TableHeadColumn>
            <TableBody>
              {tableData
                  .slice(page * rowsPerPage, Math.min((page * rowsPerPage) + rowsPerPage, tableData.length))
                  .map((row: any, key: number) => (
                      <TableRow key={key} hover={!!onRowClick} onClick={() => onRowClick && onRowClick(row)}>
                        {showCheckBoxSelection && (
                          <CheckboxTableBodyCell align="left">
                            <Checkbox
                                checked={selectedRows.includes(row[rowKey])}
                                onChange={() => handleRowSelection(row[rowKey], selectedRows.includes(row[rowKey]))}
                            />
                          </CheckboxTableBodyCell>
                        )}
                        {columns
                            .filter((column: IColumn) => !column.hideColumn)
                            .map((column: IColumn, columnKey: number) => (
                              <TableBodyCell key={columnKey} align="left">
                                {column.render ? column.render(row) : `${row[column.key]}`}
                              </TableBodyCell>
                            ))
                        }
                      </TableRow>
                    ))}
            </TableBody>
          </Table>
        </TableContainer>
          <TableFooter>
            <TablePagination
                count={tableData.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25]}
            />
          </TableFooter>
          <Popover
              open={!!anchorEl}
              anchorEl={anchorEl}
              onClose={handleMenuClose}
              anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
              }}
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
          >
              <MenuContent>
                  <DropdownOption onClick={hideColumn}>
                      Hide
                  </DropdownOption>
                  {hiddenColumns.length > 0 && (
                      <DropdownOption onClick={showAllColumns}>
                          Show All Columns
                      </DropdownOption>
                  )}
              </MenuContent>
          </Popover>
    </>
  );
};

export default CommonTable;
