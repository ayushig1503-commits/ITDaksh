import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import styled, { ThemeProvider } from "styled-components";

import AppButton from "../components/ui/AppButton";
import { ActivityPanel } from "../components/ui/ActivityPanel";

const themes = {
  dark: {
    background: "#131314",      // Gemini-style deep grey
    surface: "#1e1f20",         // Elevated surface
    surfaceLight: "#28292a",    // Hover state
    border: "#3c4043",          // Subtle stroke
    textPrimary: "#e3e3e3",
    textSecondary: "#c4c7c5",
    textMuted: "#9aa0a6",
    accent: "#a87ffb",          // Soft institutional purple
  },
  light: {
    background: "#ffffff",
    surface: "#f0f4f9",
    surfaceLight: "#e9eef6",
    border: "#dde3ea",
    textPrimary: "#1f1f1f",
    textSecondary: "#444746",
    textMuted: "#70757a",
    accent: "#6c4eb3",
  }
};

const Homepage = () => {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? themes.dark : themes.light;

  return (
    <ThemeProvider theme={theme}>
      <Main>
        <MaxContainer>
          
          {/* TOP BAR: Eyebrow + Toggle on same level */}
          <TopBar>
            <Eyebrow>Vantage Protocol</Eyebrow>
            <ToggleArea onClick={() => setIsDark(!isDark)}>
              <ToggleLabel>{isDark ? "Dark" : "Light"}</ToggleLabel>
              <ToggleTrack>
                <ToggleThumb $isDark={isDark} />
              </ToggleTrack>
            </ToggleArea>
          </TopBar>

          {/* HERO */}
          <HeroSection>
            <Heading>
              Manage your institution<br />
              with confidence.
            </Heading>
            <SubText>
              Organise classes, track attendance, manage staff, and keep
              communications structured—backed by a tamper-evident audit trail.
            </SubText>

            <Actions>
              <PrimaryBtn component={Link} to="/choose">
                Continue to dashboard
              </PrimaryBtn>
              <SecondaryBtn component={Link} to="/Adminregister">
                Create an account
              </SecondaryBtn>
            </Actions>
          </HeroSection>

          {/* ACTIVITY SECTION: Replaces Divider with a functional header */}
          <ActivityArea>
            <ActivityHeader>
              <SectionLabel>Live Institutional Activity</SectionLabel>
              <LiveStatus>
                <Pulse /> System Active
              </LiveStatus>
            </ActivityHeader>
            <Surface>
              <ActivityPanel isDark={isDark} />
            </Surface>
          </ActivityArea>

          {/* <StatsGrid>
            <StatCard>
              <StatNum>12,000+</StatNum>
              <StatLabel>Students managed across institutions</StatLabel>
            </StatCard>
            <StatCard>
              <StatNum>100%</StatNum>
              <StatLabel>Actions logged and auditable</StatLabel>
            </StatCard>
            <StatCard>
              <StatNum>Zero</StatNum>
              <StatLabel>Data loss incidents recorded</StatLabel>
            </StatCard>
          </StatsGrid> */}

        </MaxContainer>
      </Main>
    </ThemeProvider>
  );
};

export default Homepage;

/* ─── Styles: Base ───────────────────────────────────────── */

const Main = styled.main`
  width: 100%;
  min-height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textPrimary};
  transition: background 0.2s ease;
`;

const MaxContainer = styled(Box)`
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: 40px 40px 100px; /* Reduced top padding */

  @media (max-width: 600px) {
    padding: 24px 24px 64px;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

/* ─── Styles: Hero ───────────────────────────────────────── */

const HeroSection = styled.section`
  text-align: left;
  max-width: 800px;
  margin-bottom: 64px;
`;

const Eyebrow = styled.p`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${props => props.theme.accent};
  margin: 0; /* Removed margin to fix "unnecessary padding" */
`;

const Heading = styled.h1`
  font-weight: 700;
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 12px 0 20px;
`;

const SubText = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 32px;
  max-width: 540px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const PrimaryBtn = styled(AppButton)`
  background: ${props => props.theme.textPrimary};
  color: ${props => props.theme.background};
  font-weight: 700;
  &:hover { opacity: 0.9; }
`;

const SecondaryBtn = styled(AppButton)`
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.textPrimary};
  &:hover { background: ${props => props.theme.surface}; }
`;

/* ─── Styles: Activity ───────────────────────────────────── */

const ActivityArea = styled.div`
  margin-bottom: 40px;
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
`;

const SectionLabel = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => props.theme.textMuted};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const LiveStatus = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #34a853;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Pulse = styled.div`
  width: 6px;
  height: 6px;
  background: #34a853;
  border-radius: 50%;
  animation: pulse 2s infinite;
  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
`;

const Surface = styled.div`
  width: 100%;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
`;

/* ─── Styles: Toggle ─────────────────────────────────────── */

const ToggleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const ToggleLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.textMuted};
  text-transform: uppercase;
`;

const ToggleTrack = styled.div`
  width: 34px;
  height: 18px;
  background: ${props => props.theme.border};
  border-radius: 10px;
  position: relative;
`;

const ToggleThumb = styled.div`
  width: 14px;
  height: 14px;
  background: ${props => props.theme.textPrimary};
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${props => props.$isDark ? "18px" : "2px"};
  transition: left 0.2s ease;
`;