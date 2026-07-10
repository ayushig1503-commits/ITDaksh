import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Table, TableBody, TableContainer, TableHead, TableRow, TableCell,
  TablePagination, Paper, Box, Drawer, Typography, Stack, Chip, Divider, Tooltip
} from '@mui/material';

const TableViewTemplate = ({ columns, rows }) => {
  const theme = useTheme();
  const SP = theme.spacingTokens;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);

  const visibleRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={0} variant="outlined">
      <TableContainer>
        <Table stickyHeader>

          <TableHead>
            <TableRow>
              {columns.map((column) => (
<TableCell
  key={column.id}
  sx={{
    fontWeight: 600,
    fontSize: theme.typography.body2.fontSize,
    bgcolor: 'background.default',
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
  }}
>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => setSelectedRow(row)}
                sx={{ cursor: 'pointer' }}
              >
{columns.map((column) => {
  const value = row[column.id];
  return (
    <TableCell
      key={column.id}
      sx={{
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
      }}
    >
      <Tooltip
        title={value || ''}
        disableHoverListener={!value || String(value).length < 20}
      >
        <Box sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value}
        </Box>
      </Tooltip>
    </TableCell>
  );
})}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Drawer
        anchor="right"
        open={Boolean(selectedRow)}
        onClose={() => setSelectedRow(null)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 420 },
            padding: `${SP.lg}px`,
            borderLeft: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {selectedRow && (
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ marginBottom: `${SP.lg}px` }}
            >
              <Typography variant="overline">
                Announcement
              </Typography>
            </Stack>

            <Chip
              label={selectedRow.category}
              size="small"
              sx={{ marginBottom: `${SP.md}px` }}
            />

            <Typography variant="h6" sx={{ marginBottom: `${SP.sm}px` }}>
              {selectedRow.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: `${SP.lg}px` }}>
              {selectedRow.date}
            </Typography>

            <Divider sx={{ marginBottom: `${SP.lg}px` }} />

            <Typography variant="subtitle2" sx={{ marginBottom: `${SP.sm}px` }}>
              Content
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {selectedRow.details}
            </Typography>
          </Box>
        )}
      </Drawer>
    </Paper>
  );
};

export default TableViewTemplate;