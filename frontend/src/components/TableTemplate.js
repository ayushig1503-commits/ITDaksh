import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, Box, styled,
} from '@mui/material';

const commonCellStyles = (theme) => ({
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  // We leave truncation out of here so other pages can still wrap text if they want.
});

const StyledContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => prop !== 'disablePaper',
})(({ theme, disablePaper }) => ({
  backgroundColor: disablePaper ? 'transparent' : theme.palette.background.paper,
  border: disablePaper ? 'none' : `1px solid ${theme.palette.divider}`,
  borderRadius: disablePaper ? 0 : theme.shape.borderRadius,
  width: '100%',
  boxShadow: 'none',
  '& .MuiTable-root': {
    // tableLayout: 'fixed' is good for performance, 
    // but it requires us to set widths on columns (which you are doing).
    tableLayout: 'fixed', 
    width: '100%',
    borderCollapse: 'collapse',
  },
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  ...commonCellStyles(theme),
  fontWeight: 600,
  fontSize: '0.72rem',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  zIndex: 2,
  top: 0,
}));

const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  ...commonCellStyles(theme),
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  
  /* LAYER 2 FIX */
  overflow: 'hidden', 
  maxWidth: 0, // Forces the cell to follow the column width, not the content
}));

const TableTemplate = ({
  columns = [],
  rows = [],
  buttonHaver: ButtonHaver,
  onRowClick,
  disablePaper = false,
  disablePagination = false,
  defaultRowsPerPage = 10,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  useEffect(() => { setPage(0); }, [rows]);

  const visibleRows = disablePagination
    ? rows
    : rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const hasActions = !!ButtonHaver;

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <StyledContainer
        component={disablePaper ? Box : Paper}
        disablePaper={disablePaper}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <StyledHeaderCell
                  key={col.id}
                  align={col.align || 'left'}
                  style={{ width: col.width }}
                >
                  {col.label}
                </StyledHeaderCell>
              ))}
              {hasActions && (
                <StyledHeaderCell align="right" style={{ width: '100px' }}>
                  Actions
                </StyledHeaderCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, index) => (
              <TableRow
                key={row.id || row._id || index}
                hover
                onClick={() => onRowClick?.(row)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col) => (
                  <StyledBodyCell key={col.id} align={col.align || 'left'}>
                    {col.format ? col.format(row[col.id], row) : (row[col.id] ?? '—')}
                  </StyledBodyCell>
                ))}
                {hasActions && (
                  <StyledBodyCell
                    align="right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ButtonHaver row={row} />
                  </StyledBodyCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledContainer>

      {!disablePagination && rows.length > defaultRowsPerPage && (
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            fontSize: '0.8125rem',
            color: 'text.secondary',
          }}
        />
      )}
    </Box>
  );
};

export default TableTemplate;