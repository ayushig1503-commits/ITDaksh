import React, { useState, useMemo, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    CartesianGrid, ResponsiveContainer, Cell
} from "recharts";

import {
    MenuItem,
    Select,
    FormControl,
    Box,
    Typography
} from "@mui/material";

import styled from "styled-components";
import { UI } from "../theme/constants";

const EXAM_ORDER = ['PT1', 'PT2', 'HY', 'PT3', 'PT4', 'Annual'];

// Retro Production Palette
const RETRO_COLORS = {
    primary: "#556B2F",
    secondary: "#DAA520",
    accent: "#CD5C5C",
    background: "#F5F5DC",
    barGhost: "#E5E7EB"
};

const TooltipWrap = styled.div`
    background: #fff;
    border-radius: 12px;
    padding: 12px 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    border: 1px solid ${UI.border || '#e5e7eb'};
`;

/* ─────────────────────────────
    MARKS TOOLTIP
───────────────────────────── */
const MarksTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;

    if (!data.hasData) return null;

    return (
        <TooltipWrap>
            <Typography
                variant="caption"
                sx={{
                    color: UI.textSecondary,
                    fontWeight: 700,
                    textTransform: 'uppercase'
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="h5"
                sx={{
                    color: RETRO_COLORS.primary,
                    fontWeight: 800
                }}
            >
                {data.score}%
            </Typography>

            {data.max !== null && (
                <Box
                    sx={{
                        mt: 1,
                        pt: 1,
                        borderTop: `1px dashed #d1d5db`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 3
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: UI.textSecondary
                        }}
                    >
                        Marks:
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 700
                        }}
                    >
                        {data.obtained} / {data.max}
                    </Typography>
                </Box>
            )}
        </TooltipWrap>
    );
};

/* ─────────────────────────────
    ATTENDANCE TOOLTIP
───────────────────────────── */
const AttendanceTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;

    return (
        <TooltipWrap>
            <Typography
                variant="caption"
                sx={{
                    color: UI.textSecondary,
                    fontWeight: 700,
                    textTransform: 'uppercase'
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="h5"
                sx={{
                    color: RETRO_COLORS.primary,
                    fontWeight: 800
                }}
            >
                {data.percentage}%
            </Typography>
        </TooltipWrap>
    );
};

const CustomBarChart = ({
    chartData,
    type = "marks"
}) => {

    const [selectedSubject, setSelectedSubject] = useState("");

    /* ─────────────────────────────
        SUBJECTS
    ───────────────────────────── */
    const subjects = useMemo(() => {
        if (!chartData || !Array.isArray(chartData)) return [];

        const cleanNames = chartData.map(d =>
            d.subject
                ? d.subject.split(' • ')[0].trim()
                : "Unknown"
        );

        return [...new Set(cleanNames)];
    }, [chartData]);

    /* ─────────────────────────────
        INITIAL SUBJECT
    ───────────────────────────── */
    useEffect(() => {
        if (
            type === "marks" &&
            subjects.length > 0 &&
            !selectedSubject
        ) {
            setSelectedSubject(subjects[0]);
        }
    }, [subjects, selectedSubject, type]);

    /* ─────────────────────────────
        FINAL DATA
    ───────────────────────────── */
    const finalData = useMemo(() => {

        // Attendance already formatted
        if (type === "attendance") {
            return chartData;
        }

        if (!selectedSubject || !chartData) {
            return [];
        }

        return EXAM_ORDER.map(exam => {

            const match = chartData.find(d => {

                const parts = d.subject
                    ? d.subject.split(' • ')
                    : [];

                const subPart = parts[0]?.trim();
                const examPart = parts[1]?.trim();

                return (
                    subPart === selectedSubject &&
                    examPart === exam
                );
            });

            return {
                examName: exam,
                score: match
                    ? Number(match.percentage)
                    : 0,

                obtained: match?.marksObtained ?? null,
                max: match?.maxMarks ?? null,
                hasData: !!match
            };
        });

    }, [chartData, selectedSubject, type]);

    if (!chartData?.length) return null;

    return (
        <Box sx={{ width: '100%', mt: 2 }}>

            {/* ───────────────── HEADER ───────────────── */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}
            >

                <Typography
                    variant="body2"
                    sx={{
                        color: UI.textSecondary,
                        fontWeight: 600
                    }}
                >
                    {type === "marks"
                        ? "Subject Performance"
                        : "Attendance Overview"}
                </Typography>

                {/* MARKS ONLY */}
                {type === "marks" && (
                    <FormControl
                        size="small"
                        sx={{ minWidth: 180 }}
                    >
                        <Select
                            value={selectedSubject}
                            onChange={(e) =>
                                setSelectedSubject(e.target.value)
                            }
                            sx={{
                                borderRadius: '10px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                backgroundColor: '#fff',

                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db'
                                },

                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: RETRO_COLORS.primary
                                },
                            }}
                        >
                            {subjects.map(s => (
                                <MenuItem
                                    key={s}
                                    value={s}
                                >
                                    {s}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

            </Box>

            {/* ───────────────── CHART ───────────────── */}
            <Box sx={{ width: '100%', height: 350 }}>

                <ResponsiveContainer width="100%" height="100%">

                    <BarChart
                        data={finalData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 0
                        }}
                        barSize={45}
                    >

                        <CartesianGrid
                            strokeDasharray="0"
                            vertical={false}
                            stroke="#f0f0f0"
                        />

<XAxis
    dataKey={
        type === "marks"
            ? "examName"
            : "name"
    }
    axisLine={false}
    tickLine={false}
    tick={{
        fontSize: 12,
        fontWeight: 700,
        fill: UI.textPrimary
    }}
    dy={10}
    interval={0}
/>

                        <YAxis
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 11,
                                fill: UI.textSecondary
                            }}
                            tickFormatter={(val) => `${val}%`}
                        />

                        <Tooltip
                            content={
                                type === "marks"
                                    ? <MarksTooltip />
                                    : <AttendanceTooltip />
                            }
                            cursor={{
                                fill: 'rgba(0,0,0,0.03)'
                            }}
                        />

                        <Bar
                            dataKey={
                                type === "marks"
                                    ? "score"
                                    : "percentage"
                            }
                            radius={[8, 8, 0, 0]}
                            stroke={"rgba(0,0,0,0.1)"}
                            strokeWidth={1}
                        >

                            {finalData.map((entry, index) => {

                                const value =
                                    type === "marks"
                                        ? entry.score
                                        : entry.percentage;

                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            value >= 75
                                                ? RETRO_COLORS.primary
                                                : value >= 40
                                                    ? RETRO_COLORS.secondary
                                                    : RETRO_COLORS.accent
                                        }
                                    />
                                );
                            })}

                        </Bar>

                    </BarChart>

                </ResponsiveContainer>

            </Box>

        </Box>
    );
};

export default CustomBarChart;