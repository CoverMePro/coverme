import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from 'pages/Login';
import Dashboard from 'pages/Dashboard';

import './index.css';

import { ThemeProvider } from '@mui/material';
import { theme } from './theme';

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/dasbhoard" element={<Dashboard />}></Route>
					<Route path="/" element={<Navigate replace to="/login" />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
