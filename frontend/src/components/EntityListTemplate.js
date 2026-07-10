import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  TablePagination
} from '@mui/material';

import styled from 'styled-components';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { UI } from '../theme/constants';

const EntityListTemplate = ({
  items = [],
  renderActions,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 10,
  emptyTitle = "No items found",
  emptySubtitle = "Create your first item to get started."
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const paginated = items.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const hasPagination = items.length > rowsPerPageOptions[0];

  return (
    <Wrapper>
      <ListCard elevation={0}>
        {paginated.length === 0 ? (
          <EmptyState>
            <Typography
              sx={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: UI.textPrimary
              }}
            >
              {emptyTitle}
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                fontSize: '0.8125rem',
                color: UI.textSecondary,
                maxWidth: 340,
                mx: 'auto',
                lineHeight: 1.5
              }}
            >
              {emptySubtitle}
            </Typography>
          </EmptyState>
        ) : (
          paginated.map((item, index) => (
            <React.Fragment key={item.id}>
              <Row
                clickable={!!item.onClick}
                onClick={item.onClick}
              >
                <Main>
                  {item.icon && (
                    <IconWrap>
                      {item.icon}
                    </IconWrap>
                  )}

                  <Content>
                    <Typography
                      sx={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: UI.textPrimary,
                        lineHeight: 1.35,
                        wordBreak: 'break-word'
                      }}
                    >
                      {item.title}
                    </Typography>

                    {item.subtitle && (
                      <Typography
                        sx={{
                          mt: 0.4,
                          fontSize: '0.8rem',
                          color: UI.textSecondary,
                          lineHeight: 1.45,
                          wordBreak: 'break-word'
                        }}
                      >
                        {item.subtitle}
                      </Typography>
                    )}

                    {item.meta && (
                      <Box
                        sx={{
                          mt: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                          flexWrap: 'wrap'
                        }}
                      >
                        {item.meta}
                      </Box>
                    )}
                  </Content>
                </Main>

                <Actions onClick={(e) => e.stopPropagation()}>
                  {renderActions && renderActions(item)}

                  {item.onClick && (
                    <ChevronRightIcon
                      sx={{
                        fontSize: 18,
                        color: UI.textMuted,
                        flexShrink: 0
                      }}
                    />
                  )}
                </Actions>
              </Row>

              {index !== paginated.length - 1 && (
                <Divider sx={{ borderColor: UI.border }} />
              )}
            </React.Fragment>
          ))
        )}
      </ListCard>

      {hasPagination && (
        <StyledPagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      )}
    </Wrapper>
  );
};

export default EntityListTemplate;

/* ==========================
   Styles
========================== */

const Wrapper = styled.div`
  width: 100%;
`;

const ListCard = styled(Paper)`
  && {
    overflow: hidden;
    border-radius: ${UI.radiusLg};
    border: 1px solid ${UI.border};
    background: ${UI.surface};
    box-shadow: ${UI.shadowSm};
    /* Added this to prevent card from having extra bottom margin */
    margin-bottom: 0; 
  }
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 16px;
  padding: 14px 16px;
  transition: background 0.14s ease;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};

  &:hover {
    background: ${UI.backgroundSubtle};
  }
`;

const Main = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  min-width: 0;
  flex: 1;
`;

const Content = styled.div`
  min-width: 0;
  flex: 1;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  flex-shrink: 0;
  align-self: center;
`;

const IconWrap = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${UI.radiusSm};
  display: grid;
  place-items: center;
  background: ${UI.accentSubtle};
  color: ${UI.accent};
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  /* Reduced from 64px to 32px to tighten the vertical gap */
  padding: 32px 24px;
  text-align: center;
`;

const StyledPagination = styled(TablePagination)`
  && {
    border-top: 1px solid ${UI.border};
    background: ${UI.surface};
    color: ${UI.textSecondary};

    & .MuiTablePagination-toolbar {
      min-height: 54px;
      padding: 0 14px;
    }

    & .MuiTablePagination-selectLabel,
    & .MuiTablePagination-displayedRows {
      font-size: 0.875rem;
      color: ${UI.textSecondary};
    }

    & .MuiIconButton-root {
      border-radius: ${UI.radiusSm};

      &:hover {
        background: ${UI.backgroundSubtle};
      }
    }
  }
`;