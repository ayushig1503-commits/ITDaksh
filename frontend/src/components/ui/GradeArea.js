// import React from 'react';
// import { Box, Typography, Divider, useTheme, ButtonBase } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';

// const GradeArea = ({ gradeName, sectionCount, onAddSection, children }) => {
//   const theme = useTheme();
//   const SP = theme.spacingTokens;
//   const { palette } = theme;

//   const canAddSection = Boolean(onAddSection);

//   return (
//     <Box sx={{ mb: 4, width: '100%' }}>
//       {/* Header with high-density labeling */}
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: 2,
//           mb: 1.5,
//         }}
//       >
//         <Typography
//           variant="subtitle2"
//           sx={{
//             fontWeight: 800,
//             color: 'text.primary',
//             textTransform: 'uppercase',
//             letterSpacing: '0.05em',
//             fontSize: '0.75rem',
//           }}
//         >
//           {gradeName}
//         </Typography>

//         <Divider sx={{ flexGrow: 1, opacity: 0.6 }} />

//         <Typography
//           variant="caption"
//           sx={{
//             color: 'text.secondary',
//             fontWeight: 700,
//             bgcolor: 'action.selected',
//             px: 1,
//             py: 0.25,
//             borderRadius: 0.5,
//           }}
//         >
//           {sectionCount} {sectionCount === 1 ? 'SECTION' : 'SECTIONS'}
//         </Typography>
//       </Box>

//       {/* Content Stack: Removes Grid in favor of a unified List-style container */}
//       <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//         {children}

//         {/* Inline Add Action: Replaces the "Dashed Box" with a clean text-based action */}
//         {canAddSection && (
//           <ButtonBase
//             onClick={onAddSection}
//             sx={{
//               justifyContent: 'flex-start',
//               width: 'fit-content',
//               mt: 1,
//               py: 1,
//               px: 1.5,
//               borderRadius: 1,
//               color: 'primary.main',
//               transition: 'all 0.2s',
//               '&:hover': {
//                 bgcolor: 'primary.lighter', // or use alpha(palette.primary.main, 0.08)
//                 textDecoration: 'underline',
//               },
//             }}
//           >
//             <AddIcon sx={{ fontSize: 18, mr: 1 }} />
//             <Typography variant="body2" sx={{ fontWeight: 600 }}>
//               Add another section to {gradeName}
//             </Typography>
//           </ButtonBase>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default GradeArea;