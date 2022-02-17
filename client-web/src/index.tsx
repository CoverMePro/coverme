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

import { theme } from './theme';
import Home from 'pages/main/Home';
import StaffView from 'pages/owner/StaffView';
import TeamsView from 'pages/owner/TeamsView';
import Companies from 'pages/admin/Companies';
import ShiftsView from 'pages/management/ShiftsView';
import TradeView from 'pages/requests/TradeView';
import VacationView from 'pages/requests/VacationView';
import SickView from 'pages/requests/SickView';

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
                                    path="staff-view"
                                    element={
                                        <AuthWrapper permissionLevel={2}>
                                            <StaffView />
                                        </AuthWrapper>
                                    }
                                />
                                <Route
                                    path="teams"
                                    element={
                                        <AuthWrapper permissionLevel={2}>
                                            <TeamsView />
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
                                    path="shifts-view"
                                    element={
                                        <AuthWrapper permissionLevel={1}>
                                            <ShiftsView />
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
                                    path="request/vacation"
                                    element={
                                        <AuthWrapper>
                                            <VacationView />
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
