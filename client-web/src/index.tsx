import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './state';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import Login from 'pages/auth/Login';
import Dashboard from 'pages/main/Dashboard';
import Register from 'pages/auth/Register';

import AuthWrapper from 'components/auth/AuthWrapper';

import Home from 'pages/main/Home';
import StaffView from 'pages/company/StaffView';
import TeamsView from 'pages/company/TeamsView';
import Companies from 'pages/admin/Companies';
import ShiftsView from 'pages/management/ShiftsView';
import TradeView from 'pages/requests/TradeView';
import TimeOffView from 'pages/requests/TimeOffView';
import SickView from 'pages/requests/SickView';
import ScheduleView from 'pages/main/ScheduleView';
import CalendarView from 'pages/main/CalendarView';
import OvertimeView from 'pages/overtime/OvertimeView';
import OvertimeCallouts from 'pages/overtime/OvertimeCallouts';
import BlogView from 'pages/company/BlogView';

import { theme } from './theme';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={1}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
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
                                            <Home />
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
                                            <BlogView />
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
                                            <OvertimeView />
                                        </AuthWrapper>
                                    }
                                />

                                <Route
                                    path="overtime/callouts"
                                    element={
                                        <AuthWrapper>
                                            <OvertimeCallouts />
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
                                    path="request/time-off"
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
                            <Route path="/" element={<Navigate replace to="/login" />} />
                        </Routes>
                    </BrowserRouter>
                </SnackbarProvider>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
