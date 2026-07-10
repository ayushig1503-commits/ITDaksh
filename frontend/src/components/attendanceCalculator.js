// Calculate attendance percentage
export const calculateAttendancePercentage = (attendance = []) => {
    if (!Array.isArray(attendance) || attendance.length === 0) return 0;

    const validEntries = attendance.filter(entry => entry?.status);
    if (validEntries.length === 0) return 0;

    const presentDays = validEntries.filter(
        (entry) => entry.status.toLowerCase() === "present"
    ).length;

    return Number(((presentDays / validEntries.length) * 100).toFixed(2));
};

// Get attendance summary
export const getAttendanceSummary = (attendance = []) => {
    const initialState = {
        present: 0,
        absent: 0,
        total: 0,
        percentage: 0,
        records: []
    };

    if (!Array.isArray(attendance)) return initialState;

    const summary = attendance.reduce((acc, entry) => {
        const status = entry?.status?.toLowerCase();
        if (status === "present") acc.present++;
        if (status === "absent") acc.absent++;
        return acc;
    }, { present: 0, absent: 0 });

    return {
        ...summary,
        total: attendance.length,
        percentage: calculateAttendancePercentage(attendance),
        records: [...attendance]
            .filter(entry => entry?.date && entry?.status)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
    };
};

export const getMonthlyAttendance = (attendance = []) => {
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Initialize an object to hold counts for each month
    const monthlyData = {};

    attendance.forEach(entry => {
        if (!entry.date) return;
        
        const date = new Date(entry.date);
        const monthIndex = date.getMonth(); // 0-11
        const year = date.getFullYear();
        const monthKey = `${monthNames[monthIndex]} ${year}`; // e.g., "Oct 2023"

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { 
                name: monthKey, 
                present: 0, 
                total: 0, 
                sortKey: date.getTime() // used for chronological sorting
            };
        }

        monthlyData[monthKey].total++;
        if (entry.status?.toLowerCase() === "present") {
            monthlyData[monthKey].present++;
        }
    });

    return Object.values(monthlyData)
        .sort((a, b) => a.sortKey - b.sortKey)
        .map(month => ({
            name: month.name,
            present: month.present,
            total: month.total,
            percentage: Math.round((month.present / month.total) * 100)
        }));
};