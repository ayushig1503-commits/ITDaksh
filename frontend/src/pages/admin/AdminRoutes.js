import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

/* ================= LAZY IMPORTS ================= */

/* Core */
const AdminHomePage = lazy(() => import('./AdminHomePage'));
const AdminProfile = lazy(() => import('./AdminProfile'));
const SecurityPage = lazy(() => import('./SecurityPage'));
const Logout = lazy(() => import('../Logout'));

/* Student */
const AddStudent = lazy(() => import('./studentRelated/AddStudent'));
const SeeComplains = lazy(() => import('./studentRelated/SeeComplains'));
const ShowStudents = lazy(() => import('./studentRelated/ShowStudents'));
const StudentAttendance = lazy(() => import('./studentRelated/StudentAttendance'));
const StudentExamMarks = lazy(() => import('./studentRelated/StudentExamMarks'));
const ViewStudent = lazy(() => import('./studentRelated/ViewStudent'));

/* Notice */
const AddNotice = lazy(() => import('./noticeRelated/AddNotice'));
const ShowNotices = lazy(() => import('./noticeRelated/ShowNotices'));

/* Subject */
const ShowSubjects = lazy(() => import('./subjectRelated/ShowSubjects'));
const SubjectForm = lazy(() => import('./subjectRelated/SubjectForm'));
const ViewSubject = lazy(() => import('./subjectRelated/ViewSubject'));

/* Teacher */
const AddTeacher = lazy(() => import('./teacherRelated/AddTeacher'));
const ChooseClass = lazy(() => import('./teacherRelated/ChooseClass'));
const ChooseSubject = lazy(() => import('./teacherRelated/ChooseSubject'));
const ShowTeachers = lazy(() => import('./teacherRelated/ShowTeachers'));
const TeacherDetails = lazy(() => import('./teacherRelated/TeacherDetails'));

/* Class */
const AddClass = lazy(() => import('./classRelated/AddClass'));
const ClassDetails = lazy(() => import('./classRelated/ClassDetails'));
const SectionDetails = lazy(() => import('./classRelated/SectionDetails'));
const ShowClasses = lazy(() => import('./classRelated/ShowClasses'));


/* ================= ROUTES ================= */

const AdminRoutes = () => {
    return (
        <Suspense fallback={null}>
            <Routes>

                {/* Dashboard */}
                <Route index element={<AdminHomePage />} />
                <Route path="dashboard" element={<AdminHomePage />} />

                {/* Profile */}
                <Route path="profile" element={<AdminProfile />} />
                <Route path="security" element={<SecurityPage />} />

                {/* Complaints */}
                <Route path="complains" element={<SeeComplains />} />

                {/* Notices */}
                <Route path="addnotice" element={<AddNotice />} />
                <Route path="notices" element={<ShowNotices />} />

                {/* Subjects */}
                <Route path="subjects" element={<ShowSubjects />} />
                <Route path="subjects/subject/:classID/:subjectID" element={<ViewSubject />} />
                <Route path="subjects/chooseclass" element={<ChooseClass situation="Subject" />} />
                <Route path="addsubject/:id" element={<SubjectForm />} />

                {/* Class + Subject combined */}
                <Route path="class/subject/:classID/:subjectID" element={<ViewSubject />} />

                {/* Student Subject */}
                <Route
                    path="subject/student/attendance/:studentID/:subjectID"
                    element={<StudentAttendance situation="Subject" />}
                />
                <Route
                    path="subject/student/marks/:studentID/:subjectID"
                    element={<StudentExamMarks situation="Subject" />}
                />

                {/* Classes */}
                <Route path="addclass" element={<AddClass />} />
                <Route path="classes" element={<ShowClasses />} />
                <Route path="classes/class/:classGroupId" element={<ClassDetails />} />
                <Route
                    path="class/addstudents/:id"
                    element={<AddStudent situation="Class" />}
                />

                <Route path="classes/section/:id" element={<SectionDetails />} />
                
                {/* Students */}
                <Route path="addstudents" element={<AddStudent situation="Student" />} />
                
                {/* Navigate here from ShowClasses table */}
                <Route path="addstudents/class" element={<AddStudent situation="Class" />} />

                <Route path="students" element={<ShowStudents />} />
                <Route path="students/student/:id" element={<ViewStudent />} />
                <Route
                    path="students/student/attendance/:id"
                    element={<StudentAttendance situation="Student" />}
                />
                <Route
                    path="students/student/marks/:id"
                    element={<StudentExamMarks situation="Student" />}
                />

                {/* Teachers */}
                <Route path="teachers" element={<ShowTeachers />} />
                <Route path="teachers/teacher/:id" element={<TeacherDetails />} />
                <Route
                    path="teachers/chooseclass"
                    element={<ChooseClass situation="Teacher" />}
                />
                <Route
                    path="teachers/choosesubject/:id"
                    element={<ChooseSubject situation="Norm" />}
                />
                <Route
                    path="teachers/choosesubject/:classID/:teacherID"
                    element={<ChooseSubject situation="Teacher" />}
                />
<Route path="teachers/addteacher/:id" element={<AddTeacher />} />

                {/* Logout */}
                <Route path="/logout" element={<Logout />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="" />} />

            </Routes>
        </Suspense>
    );
};

export default AdminRoutes;