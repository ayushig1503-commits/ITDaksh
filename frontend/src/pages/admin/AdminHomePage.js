import { useEffect, useMemo } from 'react';
import {
  Paper,
  Box,
  Typography
} from '@mui/material';

import {
  School,
  Class,
  Groups,
  CurrencyRupee
} from '@mui/icons-material';

import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';

// Components
import PlannerPanel from '../../components/PlannerPanel';
import SeeNotice from '../../components/SeeNotice';
import StatCard from "../../components/ui/StatCard";

// Redux Actions
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import { getAllNotices } from '../../redux/noticeRelated/noticeHandle';

import { UI } from '../../theme/constants';

const getStats = (studentsList, sclassesList, teachersList) => [
  {
    title: "Total Students",
    value: studentsList?.length || 0,
    icon: <School />,
    color: 'info.main'
  },
  {
    title: "Total Classes",
    value: sclassesList?.length || 0,
    icon: <Class />,
    color: 'primary.main'
  },
  {
    title: "Total Teachers",
    value: teachersList?.length || 0,
    icon: <Groups />,
    color: 'secondary.main'
  },
  {
    title: "Fees Collected",
    value: 95000,
    icon: <CurrencyRupee />,
    prefix: "₹",
    color: 'success.main'
  }
];

const AdminHomePage = () => {
  const dispatch = useDispatch();

  const { studentsList } = useSelector((state) => state.student);
  const { sclassesList } = useSelector((state) => state.sclass);
  const { teachersList } = useSelector((state) => state.teacher);
  const { noticesList } = useSelector((state) => state.notice);
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllStudents(adminID));
      dispatch(getAllSclasses(adminID, "Sclass"));
      dispatch(getAllTeachers(adminID));
      dispatch(getAllNotices(adminID, "Notice"));
    }
  }, [adminID, dispatch]);

  const notices = useMemo(() => {
    return Array.isArray(noticesList)
      ? noticesList
      : noticesList?.noticesList || [];
  }, [noticesList]);

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Welcome back, Admin
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Here's what's happening across your institution today.
        </Typography>
      </Box>

      {/* DASHBOARD GRID */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            xl: 'minmax(0, 1fr) 320px'
          },
          gap: 3,
          alignItems: 'start'
        }}
      >
        {/* MAIN CONTENT */}
        <Box sx={{ minWidth: 0 }}>
          
          {/* KPI GRID */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
  xs: '1fr',
  sm: 'repeat(2, 1fr)',
  lg: 'repeat(4, 1fr)',
},
              gap: 2,
            }}
          >
            {getStats(studentsList, sclassesList, teachersList).map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </Box>

          {/* ANNOUNCEMENTS */}
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              mt: 3,
              overflow: 'hidden',
              borderRadius: UI.radiusSm,
            }}
          >
            {/* HEADER */}
            <Box
              sx={{
                px: 2.5,
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700 }}
              >
                Announcements
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.25 }}
              >
                Latest institution updates
              </Typography>
            </Box>

            {/* TABLE */}
            <Box sx={{ minWidth: 0 }}>
              <SeeNotice notices={notices} />
            </Box>
          </Paper>
        </Box>

        {/* RIGHT PANEL */}
        <Box
          component="aside"
          sx={{
            minWidth: 0,
            position: {
              xl: 'sticky'
            },
            top: {
              xl: 24
            }
          }}
        >
          <PlannerPanel notices={notices} />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminHomePage;