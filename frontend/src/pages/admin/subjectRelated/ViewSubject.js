// import React, {
//   useEffect,
//   useMemo,
//   useState
// } from "react";

// import {
//   useNavigate,
//   useParams
// } from "react-router-dom";

// import {
//   useDispatch,
//   useSelector
// } from "react-redux";

// import {
//   Box,
//   Tab,
//   Stack,
//   Typography,
//   Chip,
//   Alert,
//   ToggleButton,
//   ToggleButtonGroup,
// } from "@mui/material";

// import {
//   InsertChartOutlined as MarksIcon,
//   TableChartOutlined as AttendanceIcon,
//   GroupsOutlined as GroupsIcon,
//   MenuBookOutlined as MenuBookIcon,
//   PersonOutline as PersonIcon,
//   SchoolOutlined as SchoolIcon
// } from "@mui/icons-material";

// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import TabPanel from "@mui/lab/TabPanel";

// import {
//   getClassStudents,
//   getSubjectDetails
// } from "../../../redux/sclassRelated/sclassHandle";

// import TableTemplate from "../../../components/TableTemplate";

// import AppButton from "../../../components/ui/AppButton";
// import PageIntro from "../../../components/ui/PageIntro";
// import DataSection from "../../../components/ui/DataSection";
// import PageLoader from "../../../components/ui/PageLoader";

// import { UI } from "../../../theme/constants";

// const ViewSubject = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const {
//     classID,
//     subjectID
//   } = useParams();

//   const {
//     subloading,
//     subjectDetails,
//     sclassStudents,
//     getresponse,
//     error,
//   } = useSelector((state) => state.sclass);

//   const [tabValue, setTabValue] = useState("details");

//   const [studentMode, setStudentMode] =
//     useState("attendance");

//   useEffect(() => {
//     dispatch(
//       getSubjectDetails(subjectID, "Subject")
//     );

//     dispatch(getClassStudents(classID));
//   }, [dispatch, subjectID, classID]);

//   const students = useMemo(
//     () =>
//       Array.isArray(sclassStudents)
//         ? sclassStudents
//         : [],
//     [sclassStudents]
//   );

//   const studentRows = students.map((student) => ({
//     rollNum: student.rollNum,
//     name: student.name,
//     id: student._id,
//   }));

//   const studentColumns = [
//     {
//       id: "rollNum",
//       label: "Roll No.",
//       width: "20%",
//       format: (val) => (
//         <Typography
//           sx={{
//             fontSize: "0.875rem",
//             color: UI.textSecondary,
//             fontWeight: 500
//           }}
//         >
//           {val || "—"}
//         </Typography>
//       )
//     },

//     {
//       id: "name",
//       label: "Student Name",
//       width: "80%",
//       format: (val) => (
//         <Typography
//           sx={{
//             fontWeight: 600,
//             fontSize: "0.9rem"
//           }}
//         >
//           {val}
//         </Typography>
//       )
//     }
//   ];

//   const AttendanceActions = ({ row }) => (
//     <Stack direction="row" spacing={1}>
//       <AppButton
//         variant="ghost"
//         size="small"
//         onClick={() =>
//           navigate(
//             `/Admin/students/student/${row.id}`
//           )
//         }
//       >
//         View
//       </AppButton>

//       <AppButton
//         variant="ghost"
//         size="small"
//         onClick={() =>
//           navigate(
//             `/Admin/subject/student/attendance/${row.id}/${subjectID}`
//           )
//         }
//       >
//         Take Attendance
//       </AppButton>
//     </Stack>
//   );

//   const MarksActions = ({ row }) => (
//     <Stack direction="row" spacing={1}>
//       <AppButton
//         variant="ghost"
//         size="small"
//         onClick={() =>
//           navigate(
//             `/Admin/students/student/${row.id}`
//           )
//         }
//       >
//         View
//       </AppButton>

//       <AppButton
//         variant="ghost"
//         size="small"
//         onClick={() =>
//           navigate(
//             `/Admin/subject/student/marks/${row.id}/${subjectID}`
//           )
//         }
//       >
//         Provide Marks
//       </AppButton>
//     </Stack>
//   );

//   if (subloading) {
//     return <PageLoader />;
//   }

//   return (
//     <Box sx={{ width: "100%", pb: 4 }}>

//       {/* ── PAGE INTRO ── */}
//       <PageIntro
//         title={subjectDetails?.subName || "Subject"}
//         subtitle={`${students.length} Students • ${subjectDetails?.sessions || 0} Sessions`}
//       />

//       {error && (
//         <Alert
//           severity="error"
//           sx={{ mb: 3 }}
//         >
//           Failed to load subject details.
//         </Alert>
//       )}

//       {/* ── TABS ── */}
//       <TabContext value={tabValue}>
//         <Box
//           sx={{
//             borderBottom: `1px solid ${UI.border}`,
//             mb: 4
//           }}
//         >
//           <TabList
//             onChange={(e, val) =>
//               setTabValue(val)
//             }
//           >
//             <Tab
//               label="Details"
//               value="details"
//             />

//             <Tab
//               label="Students"
//               value="students"
//             />
//           </TabList>
//         </Box>

//         {/* ── DETAILS TAB ── */}
//         <TabPanel
//           value="details"
//           sx={{ px: 0 }}
//         >
//           <DataSection title="Overview">
//             <Stack spacing={3}>

//               <Stack
//                 direction="row"
//                 spacing={1}
//                 flexWrap="wrap"
//                 useFlexGap
//               >
//                 <Chip
//                   icon={<MenuBookIcon />}
//                   label={`Code: ${subjectDetails?.subCode || "—"}`}
//                 />

//                 <Chip
//                   icon={<GroupsIcon />}
//                   label={`${students.length} Students`}
//                 />

//                 <Chip
//                   label={`${subjectDetails?.sessions || 0} Sessions`}
//                 />
//               </Stack>

//               <Box
//                 sx={{
//                   borderTop: `1px solid ${UI.border}`,
//                   pt: 3
//                 }}
//               >
//                 <Stack spacing={2}>

//                   <Stack
//                     direction="row"
//                     spacing={1}
//                     alignItems="center"
//                   >
//                     <SchoolIcon
//                       sx={{
//                         fontSize: 18,
//                         color: UI.textMuted
//                       }}
//                     />

//                     <Typography
//                       sx={{
//                         fontSize: "0.9rem"
//                       }}
//                     >
//                       Class{" "}
//                       {subjectDetails?.sclassName?.sclassName || "—"}
//                     </Typography>
//                   </Stack>

//                   <Stack
//                     direction="row"
//                     spacing={1}
//                     alignItems="center"
//                   >
//                     <PersonIcon
//                       sx={{
//                         fontSize: 18,
//                         color: UI.textMuted
//                       }}
//                     />

//                     <Typography
//                       sx={{
//                         fontSize: "0.9rem"
//                       }}
//                     >
//                       Teacher:{" "}
//                       {subjectDetails?.teacher?.name ||
//                         "Not assigned"}
//                     </Typography>
//                   </Stack>

//                 </Stack>
//               </Box>

//               {!subjectDetails?.teacher && (
//                 <Box>
//                   <AppButton
//                     startIcon={<PersonIcon />}
//                     onClick={() =>
//                       navigate(
//                         `/Admin/teachers/addteacher/${subjectDetails?._id}`
//                       )
//                     }
//                   >
//                     Assign Subject Teacher
//                   </AppButton>
//                 </Box>
//               )}

//             </Stack>
//           </DataSection>
//         </TabPanel>

//         {/* ── STUDENTS TAB ── */}
//         <TabPanel
//           value="students"
//           sx={{ px: 0 }}
//         >
//           <DataSection
//             title="Students"
//             action={
//               <ToggleButtonGroup
//                 size="small"
//                 exclusive
//                 value={studentMode}
//                 onChange={(e, val) => {
//                   if (val) {
//                     setStudentMode(val);
//                   }
//                 }}
//               >
//                 <ToggleButton value="attendance">
//                   <AttendanceIcon
//                     sx={{ fontSize: 18, mr: 0.5 }}
//                   />
//                   Attendance
//                 </ToggleButton>

//                 <ToggleButton value="marks">
//                   <MarksIcon
//                     sx={{ fontSize: 18, mr: 0.5 }}
//                   />
//                   Marks
//                 </ToggleButton>
//               </ToggleButtonGroup>
//             }
//             isEmpty={getresponse}
//             emptyText="No students found for this class."
//           >

//             <TableTemplate
//               columns={studentColumns}
//               rows={studentRows}
//               buttonHaver={
//                 studentMode === "attendance"
//                   ? AttendanceActions
//                   : MarksActions
//               }
//             />

//           </DataSection>
//         </TabPanel>
//       </TabContext>
//     </Box>
//   );
// };

// export default ViewSubject;