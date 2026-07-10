import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Stack, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

import { getAllClassGroups } from '../../../redux/sclassRelated/sclassHandle';

import AppButton from "../../../components/ui/AppButton";
import TableTemplate from '../../../components/TableTemplate';

const Container = styled.div`
  padding: 20px;
  width: 100%;
`;

const HeaderStack = styled(Stack)`
  margin-bottom: 24px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 700;
`;

const ChooseClass = ({ situation }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { classGroupsList, loading, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllClassGroups(currentUser._id));
    }, [currentUser._id, dispatch]);

    const navigateHandler = (classID) => {
        if (situation === "Teacher") {
            /* CRITICAL FIX: 
               We must go to ChooseSubject first. 
               This ensures the final AddTeacher page receives a SUBJECT ID, 
               allowing it to load 'subjectDetails' correctly.
            */
            navigate("/Admin/teachers/choosesubject/" + classID) 
        }
        else if (situation === "Subject") {
            navigate("/Admin/addsubject/" + classID)
        }
    }

    const sclassColumns = [
        { id: 'name', label: 'Class Name', minWidth: 170 },
    ]

    const sclassRows = classGroupsList?.length > 0 ? classGroupsList.map((group) => ({
        name: group.name, 
        id: group._id,    
    })) : [];

    const SclassButtonHaver = ({ row }) => {
        return (
            <AppButton 
                size="small" 
                onClick={() => navigateHandler(row.id)}
            >
                Choose
            </AppButton>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#7965b0' }} />
            </Box>
        );
    }

    return (
        <Container>
            <HeaderStack>
                <Box>
                    <Title>Choose a Class</Title>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Select the grade level to manage {situation === "Teacher" ? "faculty assignments" : "subjects"}
                    </Typography>
                </Box>
                
                {(getresponse || sclassRows.length === 0) && (
                    <AppButton onClick={() => navigate("/Admin/addclass")}>
                        Add Class
                    </AppButton>
                )}
            </HeaderStack>

            {sclassRows.length > 0 ? (
                <TableTemplate 
                    buttonHaver={SclassButtonHaver} 
                    columns={sclassColumns} 
                    rows={sclassRows} 
                />
            ) : (
                <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                    <Typography sx={{ color: '#64748b' }}>
                        No class groups found. Please add a class first.
                    </Typography>
                </Box>
            )}
        </Container>
    )
}

export default ChooseClass;