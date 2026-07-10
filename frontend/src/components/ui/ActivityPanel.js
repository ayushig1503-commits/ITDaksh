import { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

/* ─── Cleaner, product-like logs ─────────────────────────── */

const BASE_LOGS = [
  { type: "auth",   action: "Signed in",                          user: "Admin",  time: "just now" },
  { type: "create", action: "Class created — Grade 10 · Section B", user: "Admin",  time: "1m ago" },
  { type: "create", action: "Student record added",               user: "Staff",  time: "3m ago" },
  { type: "update", action: "Notice updated",                     user: "System", time: "6m ago" },
  { type: "delete", action: "Subject removed — Grade 9",          user: "Admin",  time: "10m ago" },
];

/* Pool for subtle “live” additions */
const LIVE_EVENTS = [
  { type: "update", action: "Attendance marked — Grade 8", user: "Staff" },
  { type: "create", action: "New class scheduled", user: "Admin" },
  { type: "update", action: "Permissions updated", user: "Admin" },
  { type: "create", action: "Notice published", user: "System" },
];

/* ─── Icons ─────────────────────────────────────────────── */

const TYPE_CONFIG = (theme) => ({
  auth:   { color: theme.accent, icon: AuthIcon },
  create: { color: "#34a853", icon: CreateIcon },
  update: { color: "#4285f4", icon: UpdateIcon },
  delete: { color: "#ea4335", icon: DeleteIcon },
});

function AuthIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
      <rect x="2" y="5.5" width="8" height="5.5" rx="1" stroke={color} strokeWidth="1.2" />
      <path d="M4 5.5V4a2 2 0 014 0v1.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CreateIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
      <path d="M6 2v8M2 6h8" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function UpdateIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
      <path d="M8.5 2L10 3.5l-6 6H2.5V8l6-6z" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeleteIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
      <path d="M2 6h8" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Component ─────────────────────────────────────────── */

export const ActivityPanel = ({ isDark }) => {
  const prefersReducedMotion = useReducedMotion();
  const initialLogs = useMemo(() => BASE_LOGS, []);
  const [logs, setLogs] = useState(initialLogs);

  /* Subtle “live system” effect */
  useEffect(() => {
    const interval = setInterval(() => {
      const next = LIVE_EVENTS[Math.floor(Math.random() * LIVE_EVENTS.length)];

      setLogs(prev => [
        { ...next, time: "just now" },
        ...prev.slice(0, 4)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Panel
      as={motion.section}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PanelHeader>
        <HeaderTitle>Audit log</HeaderTitle>
      </PanelHeader>

      <LogList>
        <AnimatePresence initial={false}>
          {logs.map((log, i) => {
            const config = TYPE_CONFIG({ accent: "#a87ffb" })[log.type];
            const Icon = config.icon;

            return (
              <LogEntry
                as={motion.div}
                key={log.action + i}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <IconCol>
                  <Icon color={config.color} />
                  {i < logs.length - 1 && <ConnectorLine />}
                </IconCol>

                <LogBody>
                  <LogAction>{log.action}</LogAction>
                  <LogMeta>
                    <LogUser>{log.user}</LogUser>
                    <Dot />
                    <LogTime>{log.time}</LogTime>
                  </LogMeta>
                </LogBody>
              </LogEntry>
            );
          })}
        </AnimatePresence>
      </LogList>

      <PanelFooter>
        <FooterLabel>SHA-256 chained</FooterLabel>
      </PanelFooter>
    </Panel>
  );
};

/* ─── Styles (denser, tighter) ─────────────────────────── */

const Panel = styled.div`
  width: 100%;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.textPrimary};
  border-radius: 14px;
  border: 1px solid ${props => props.theme.border};
`;

const PanelHeader = styled.div`
  padding: 14px 18px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const HeaderTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.textMuted};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const LogList = styled.div`
  padding: 6px 0;
`;

const LogEntry = styled.div`
  display: flex;
  gap: 12px;
  padding: 10px 18px;
`;

const IconCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
`;

const ConnectorLine = styled.div`
  width: 1px;
  flex: 1;
  margin-top: 6px;
  background: ${props => props.theme.border};
  opacity: 0.4;
`;

const LogBody = styled.div`
  flex: 1;
`;

const LogAction = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4;
`;

const LogMeta = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 2px;
`;

const LogUser = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.textMuted};
`;

const Dot = styled.span`
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: ${props => props.theme.textMuted};
`;

const LogTime = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.textMuted};
`;

const PanelFooter = styled.div`
  padding: 10px 18px;
  border-top: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.background};
`;

const FooterLabel = styled.span`
  font-size: 0.7rem;
  color: ${props => props.theme.textMuted};
  font-family: ui-monospace, monospace;
`;