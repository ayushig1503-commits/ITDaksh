import React, { useMemo, useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import {
  Paper, Box, Typography, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const CATEGORY_COLORS = {
  Exam: "#ef4444",
  Holiday: "#10b981",
  Event: "#f59e0b",
};

const PlannerPanel = ({ notices = [] }) => {
  const theme = useTheme();
  const { spacingTokens: SP, palette } = theme;

  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendarRef = useRef(null);
  const navigate = useNavigate();

  // ⚠️ DO NOT TOUCH — preserves sidebar resize correctness
  useEffect(() => {
    const timer = setTimeout(() => {
      calendarRef.current?.getApi().updateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, [notices]);

  const sameDay = (a, b) =>
    new Date(a).toDateString() === new Date(b).toDateString();

  const allEvents = useMemo(() => {
    const raw = Array.isArray(notices)
      ? notices
      : notices?.noticesList || [];

    return raw
      .filter(n => n.showOnCalendar)
      .map((n, i) => {
        const color = CATEGORY_COLORS[n.category] || palette.primary.main;

        return {
          id: String(n._id || i),
          title: n.title,
          start: n.date
            ? new Date(n.date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          backgroundColor: color,
          extendedProps: {
            description: n.details,
            category: n.category || 'Announcement',
            color,
          },
        };
      });
  }, [notices, palette.primary.main]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allEvents
      .filter(e => new Date(e.start) >= today)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 5);
  }, [allEvents]);

  const handleDateClick = ({ dateStr }) => {
    if (window.confirm(`Add new announcement for ${dateStr}?`)) {
      navigate('/Admin/addnotice', { state: { prefillDate: dateStr } });
    }
  };

  const handleEventClick = ({ event, jsEvent }) => {
    jsEvent.stopPropagation();

    setSelectedEvent({
      title: event.title,
      details: event.extendedProps.description,
      category: event.extendedProps.category,
      color: event.extendedProps.color,
      date: event.startStr,
    });

    setOpen(true);
  };

  const renderEventContent = (arg) => {
    const events = arg.view.calendar
      .getEvents()
      .filter(e => sameDay(e.start, arg.event.start));

    const index = events.findIndex(e => e.id === arg.event.id);
    if (index > 1) return { domNodes: [] };

    const remaining = events.length - 2;

    const wrapper = document.createElement('div');
    wrapper.className = 'event-pill';
    wrapper.innerText = arg.event.title;
    wrapper.style.setProperty('--event-color', arg.event.extendedProps.color);

    if (index === 1 && remaining > 0) {
      const container = document.createElement('div');
      const more = document.createElement('div');

      more.className = 'event-more';
      more.innerText = `+${remaining} more`;

      container.appendChild(wrapper);
      container.appendChild(more);

      return { domNodes: [container] };
    }

    return { domNodes: [wrapper] };
  };

  return (
    <Paper
      sx={{
        borderRadius: `${SP.sm}px`,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >

      {/* Calendar */}
      <Box
        sx={{
          padding: `${SP.sm}px`,
          width: '100%',
          overflow: 'hidden',

          "& .fc": { fontSize: '0.7rem' },

          "& .fc-toolbar": {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginBottom: `${SP.sm}px`,
          },

          "& .fc-toolbar-chunk:last-of-type": {
            position: 'absolute',
            right: 0,
          },

          "& .fc-toolbar-title": {
            fontSize: '0.9rem !important',
            fontWeight: 700,
            color: palette.text.primary,
            margin: 0,
          },

          "& .fc-button": {
            background: 'transparent !important',
            border: 'none !important',
            color: palette.text.secondary,
            boxShadow: 'none !important',
          },

          "& .fc-daygrid-day:hover": {
            backgroundColor: `${palette.primary.main}12 !important`,
            cursor: 'pointer',
          },

          "& .fc-scrollgrid, & .fc-col-header, & .fc-daygrid-body, & .fc-daygrid-body table": {
            width: '100% !important',
            tableLayout: 'fixed !important',
          },

          "& .fc-daygrid-event": {
            display: "block !important",
            background: "transparent !important",
            border: "none !important",
            padding: 0,
            margin: 0,
            marginBottom: "2px",
          },

          "& .event-pill": {
            fontSize: "0.68rem",
            padding: "1px 6px",
            borderRadius: `${SP.sm / 2}px`,
            color: "var(--event-color)",
            backgroundColor: "color-mix(in srgb, var(--event-color) 12%, transparent)",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          },

          "& .event-more": {
            fontSize: "0.65rem",
            color: palette.text.secondary,
          },
        }}
      >

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={allEvents}
          height="auto"
          contentHeight="auto"
          expandRows
          handleWindowResize
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventContent={renderEventContent}
          eventDisplay="block"

          headerToolbar={{
            left: '',
            center: 'title',
            right: 'prev,next',
          }}

          dayCellDidMount={(arg) => {
            arg.el.setAttribute("role", "presentation");
          }}

          dayHeaderDidMount={(arg) => {
            arg.el.setAttribute("role", "presentation");
          }}

          eventDidMount={(arg) => {
            arg.el.setAttribute(
              "aria-label",
              `${arg.event.title} on ${arg.event.start?.toDateString()}`
            );
          }}
        />
      </Box>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        {selectedEvent && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              {selectedEvent.title}
            </DialogTitle>

            <DialogContent>
              <Chip
                label={selectedEvent.category}
                size="small"
                sx={{
                  bgcolor: selectedEvent.color,
                  color: '#fff',
                  mb: `${SP.md}px`,
                }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mb: `${SP.sm}px` }}>
                {new Date(selectedEvent.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Typography>

              <Divider sx={{ my: `${SP.sm}px` }} />

              <Typography variant="body2">
                {selectedEvent.details}
              </Typography>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Divider />

      {/* Upcoming */}
      <Box
        sx={{
          padding: `${SP.md}px`,
          flexGrow: 1,
          bgcolor: 'background.paper',
          overflowY: 'auto',
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: `${SP.md}px` }}>
          Upcoming Events
        </Typography>

        {upcomingEvents.map((event) => (
          <Box
            key={event.id}
            sx={{
              mb: `${SP.sm}px`,
              p: `${SP.sm}px`,
              borderRadius: `${SP.sm}px`,
              bgcolor: 'background.default',
              borderLeft: `4px solid ${event.backgroundColor}`,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {event.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default PlannerPanel;