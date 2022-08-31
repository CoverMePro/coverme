import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { store } from './state';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import Dashboard from 'components/dashboard/Dashboard';
import AuthWrapper from 'components/auth/AuthWrapper';

import LoginView from 'pages/auth/LoginView';
import RegisterView from 'pages/auth/RegisterView';
import HomeView from 'pages/main/HomeView';
import StaffView from 'pages/main/StaffView';
import TeamsView from 'pages/main/TeamsView';
import Companies from 'pages/admin/CompaniesView';
import ShiftsView from 'pages/management/ShiftsView';
import TradeView from 'pages/requests/TradeView';
import TimeOffView from 'pages/requests/TimeOffView';
import SickView from 'pages/requests/SickView';
import ScheduleView from 'pages/main/ScheduleView';
import CalendarView from 'pages/main/CalendarView';
import OvertimeListView from 'pages/overtime/OvertimeListView';
import OvertimeCalloutsView from 'pages/overtime/OvertimeCalloutsView';
import MessageBoardView from 'pages/main/MessageBoardView';

import { theme } from './theme';
import OvertimeConfirmationView from 'pages/overtime/OvertimeConfirmationView';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={1}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<LoginView />} />
                            <Route path="/register" element={<RegisterView />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <AuthWrapper>
                                        <Dashboard />
                                    </AuthWrapper>
                                }
                            >
                                <Route
                                    path=""
                                    element={<Navigate replace to="/dashboard/home" />}
                                />
                                <Route
                                    path="home"
                                    element={
                                        <AuthWrapper>
                                            <HomeView />
                                        </AuthWrapper>
                                    }
                                />

                                <Route
                                    path="schedule"
                                    element={
                                        <AuthWrapper>
                                            <ScheduleView />
                                        </AuthWrapper>
                                    }
                                />

                                <Route
                                    path="calendar"
                                    element={
                                        <AuthWrapper>
                                            <CalendarView />
                                        </AuthWrapper>
                                    }
                                />

                                <Route
                                    path="staff"
                                    element={
                                        <AuthWrapper>
                                            <StaffView />
                                        </AuthWrapper>
                                    }
                                />
                                <Route
                                    path="teams"
                                    element={
                                        <AuthWrapper>
                                            <TeamsView />
                                        </AuthWrapper>
                                    }
                                />

                                <Route
                                    path="blog"
                                    element={
                                        <AuthWrapper>
                                            <MessageBoardView />
                                        </AuthWrapper>
                                    }
                                />
                                <Route
                                    path="companies"
                                    element={
                                        <AuthWrapper permissionLevel={3}>
                                            <Companies />
                                        </AuthWrapper>
                                    }
                                />
                                <Route
                                    path="shifts"
                                    element={
                                        <AuthWrapper permissionLevel={1}>
                                            <ShiftsView />
                                        </AuthWrapper>
                                    }
                                />

                                <Route
                                    path="overtime/list"
                                    element={
                                        <AuthWrapper>
                                            <OvertimeListView />
                                        </AuthWrapper>
                                    }
                                />

                                <Route
                                    path="overtime/callouts"
                                    element={
                                        <AuthWrapper>
                                            <OvertimeCalloutsView />
                                        </AuthWrapper>
                                    }
                                />

                                <Route
                                    path="request/trade"
                                    element={
                                        <AuthWrapper>
                                            <TradeView />
                                        </AuthWrapper>
                                    }
                                />

                                <Route
                                    path="request/leave"
                                    element={
                                        <AuthWrapper>
                                            <TimeOffView />
                                        </AuthWrapper>
                                    }
                                />

                                <Route
                                    path="request/sick"
                                    element={
                                        <AuthWrapper>
                                            <SickView />
                                        </AuthWrapper>
                                    }
                                />
                            </Route>

                            <Route
                                path="overtime-confirmation"
                                element={<OvertimeConfirmationView />}
                            />
                            <Route path="/" element={<Navigate replace to="/login" />} />
                        </Routes>
                    </BrowserRouter>
                </SnackbarProvider>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
