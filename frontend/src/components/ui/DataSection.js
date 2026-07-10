import React from "react";

import SectionBlock from "./SectionBlock";
import EmptyState from "./EmptyState";

const DataSection = ({
  title,
  action = null,
  children,
  isEmpty = false,
  emptyText = "No data available.",
  emptyComponent = null,

  sx = {},
  contentSx = {},
  headerSx = {},

  emptyStateProps = {}
}) => {
  return (
    <SectionBlock
      title={title}
      action={action}
      sx={sx}
      contentSx={contentSx}
      headerSx={headerSx}
    >
      {isEmpty ? (
        emptyComponent || (
          <EmptyState {...emptyStateProps}>
            {emptyText}
          </EmptyState>
        )
      ) : (
        children
      )}
    </SectionBlock>
  );
};

export default DataSection;