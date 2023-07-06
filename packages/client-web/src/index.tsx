import './index.css';
import './messaging_init_in_sw';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { store } from './state';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import Portal from 'components/portal/Portal';
import AuthWrapper from 'components/auth/AuthWrapper';

import LoginView from 'pages/auth/LoginView';
import RegisterView from 'pages/auth/RegisterView';
import HomeView from 'pages/main/HomeView';
import StaffView from 'pages/main/StaffView';
import TeamsView from 'pages/main/TeamsView';
import UsersView from 'pages/main/UsersView';
import SettingsView from 'pages/main/SettingsView';
import NotFound from 'pages/main/NotFound';
//import ShiftsView from 'pages/_deprecated/management/ShiftsView';
//import OvertimeListView from 'pages/_deprecated/overtime/OvertimeListView';
import OvertimeCalloutsView from 'pages/main/OvertimeCalloutsView';

import { theme } from './theme';

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
								path="/portal"
								element={
									<AuthWrapper>
										<Portal />
									</AuthWrapper>
								}
							>
								<Route path="" element={<Navigate replace to="/portal/home" />} />
								<Route
									path="home"
									element={
										<AuthWrapper>
											<HomeView />
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

								{/* <Route
									path="shift-templates"
									element={
										<AuthWrapper permissionLevel={1}>
											<ShiftsView />
										</AuthWrapper>
									}
								/> */}
								<Route
									path="users"
									element={
										<AuthWrapper permissionLevel={1}>
											<UsersView />
										</AuthWrapper>
									}
								/>
								<Route
									path="settings"
									element={
										<AuthWrapper permissionLevel={1}>
											<SettingsView />
										</AuthWrapper>
									}
								/>

								{/* <Route
									path="overtime/list"
									element={
										<AuthWrapper>
											<OvertimeListView />
										</AuthWrapper>
									}
								/> */}

								<Route
									path="overtime/callouts"
									element={
										<AuthWrapper>
											<OvertimeCalloutsView />
										</AuthWrapper>
									}
								/>

								<Route
									path="callouts"
									element={
										<AuthWrapper>
											<OvertimeCalloutsView />
										</AuthWrapper>
									}
								/>
							</Route>
							<Route path="/" element={<Navigate replace to="/login" />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</SnackbarProvider>
			</ThemeProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
