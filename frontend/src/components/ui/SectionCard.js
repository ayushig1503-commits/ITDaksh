// import React from 'react';
// import { Box, Typography, IconButton, Stack } from '@mui/material';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import GroupsIcon from '@mui/icons-material/Groups';
// import BookIcon from '@mui/icons-material/Book';
// import { UI } from '../../theme/constants';

// const SectionRow = ({ section, onClick, onMenuOpen }) => {
//   const teacherName = section.classTeacher?.name;

//   return (
//     <Box
//       onClick={() => onClick(section)}
//       role="button"
//       tabIndex={0}
//       onKeyDown={(e) => e.key === 'Enter' && onClick(section)}
//       sx={{
//         display: 'flex',
//         alignItems: 'center',
//         py: 1.75, // Balanced vertical padding
//         px: 2.5,
//         mx: 1, // Slight margin so the hover background doesn't hit the screen edge
//         borderRadius: '8px', // Softer feel on hover
//         borderBottom: `1px solid ${UI.borderLight || '#f0f0f0'}`,
//         transition: 'all 0.2s ease',
//         cursor: 'pointer',
//         '&:hover': {
//           bgcolor: 'rgba(0, 0, 0, 0.03)', 
//           transform: 'translateX(4px)', // Subtle "slide" feedback
//           '& .menu-btn': { opacity: 1 },
//         },
//       }}
//     >
//       {/* 1. Section Identity */}
//       <Box sx={{ width: '180px', flexShrink: 0 }}>
//         <Typography 
//           sx={{ 
//             fontWeight: 600, 
//             fontSize: 14, 
//             color: UI.textPrimary 
//           }}
//         >
//           Section {section.name}
//         </Typography>
//       </Box>

//       {/* 2. Primary Stats Container */}
//       <Stack 
//         direction="row" 
//         spacing={8} // Wide spacing for better horizontal scan-ability
//         sx={{ flexGrow: 1, ml: 2 }}
//       >
//         {/* Students Stat */}
//         <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: '100px' }}>
//           <GroupsIcon sx={{ fontSize: 20, color: UI.textMuted }} />
//           <Box>
//             <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.1 }}>
//               {section.studentCount || 0}
//             </Typography>
//             <Typography 
//               sx={{ 
//                 fontSize: 10, 
//                 color: UI.textMuted, 
//                 textTransform: 'uppercase', 
//                 letterSpacing: 1,
//                 fontWeight: 600 
//               }}
//             >
//               Students
//             </Typography>
//           </Box>
//         </Stack>

//         {/* Subjects Stat */}
//         <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: '100px' }}>
//           <BookIcon sx={{ fontSize: 18, color: UI.textMuted }} />
//           <Box>
//             <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.1 }}>
//               {section.subjectCount || 0}
//             </Typography>
//             <Typography 
//               sx={{ 
//                 fontSize: 10, 
//                 color: UI.textMuted, 
//                 textTransform: 'uppercase', 
//                 letterSpacing: 1,
//                 fontWeight: 600 
//               }}
//             >
//               Subjects
//             </Typography>
//           </Box>
//         </Stack>
//       </Stack>

//       {/* 3. Teacher Assignment */}
//       <Stack 
//         direction="row" 
//         spacing={1} 
//         alignItems="center" 
//         sx={{ width: '240px', flexShrink: 0 }}
//       >
//         <PersonOutlineIcon sx={{ fontSize: 18, color: UI.textMuted }} />
//         <Typography 
//           sx={{ 
//             fontSize: 13, 
//             fontWeight: 500,
//             color: teacherName ? UI.textSecondary : UI.textMuted,
//             fontStyle: teacherName ? 'normal' : 'italic'
//           }}
//         >
//           {teacherName ?? 'Unassigned'}
//         </Typography>
//       </Stack>

//       {/* 4. Action Menu */}
//       <Box sx={{ width: '40px', display: 'flex', justifyContent: 'flex-end' }}>
//         <IconButton
//           className="menu-btn"
//           size="small"
//           onClick={(e) => {
//             e.stopPropagation();
//             onMenuOpen(e, section);
//           }}
//           sx={{ 
//             opacity: 0, 
//             transition: 'opacity 0.2s',
//             '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
//           }}
//         >
//           <MoreVertIcon fontSize="small" sx={{ color: UI.textMuted }} />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// };

// export default SectionRow;