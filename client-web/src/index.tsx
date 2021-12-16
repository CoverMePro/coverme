import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './state';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import Login from 'pages/auth/Login';
import Dashboard from 'pages/Dashboard';
import Onboard from 'pages/auth/Onboard';
import RegisterUser from 'pages/dev/RegisterUser';
import CreateCompany from 'pages/dev/CreateCompany';

import AuthWrapper from 'components/auth/AuthWrapper';

import { theme } from './theme';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<SnackbarProvider maxSnack={1}>
					<BrowserRouter>
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/onboard" element={<Onboard />} />
							<Route
								path="/dashboard"
								element={
									<AuthWrapper>
										<Dashboard />
									</AuthWrapper>
								}
							/>
							<Route
								path="/register-user"
								element={
									<AuthWrapper permission="manager">
										<RegisterUser />
									</AuthWrapper>
								}
							/>
							<Route
								path="/create-company"
								element={
									<AuthWrapper permission="admin">
										<CreateCompany />
									</AuthWrapper>
								}
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
