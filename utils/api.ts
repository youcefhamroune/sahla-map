import axios, { AxiosRequestConfig } from 'axios';
import { TOKEN_NAME } from './values';

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
});

api.interceptors.request.use(
	config => {
		if (!config?.headers?.Authorization) {
			const token = localStorage.getItem(TOKEN_NAME);
			if (token && config?.headers) {
				config.headers['Authorization'] = 'Bearer ' + token;
			}
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(async response => {
	const originalConfig = response.config as AxiosRequestConfig & { _retry?: boolean };
	const token = localStorage.getItem(TOKEN_NAME);

	if (response) {
		// Access Token was expired
		if (response.status == 401 && !originalConfig._retry) {
			originalConfig._retry = true;
			try {
				const res = await api.post('dash/refresh', null, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const { token: t } = res.data;
				localStorage.setItem(TOKEN_NAME, t);
				return api(originalConfig);
			} catch (_error) {
				return Promise.reject(_error);
			}
		} else if (response.status == 403) {
			return { success: false };
		}
	}

	return response;
});

export const isAuthenticated = async () => {
	try {
		const res = await api.get('dash/auth');
		return res.data;
	} catch (error) {
		return { auth: false };
	}
};
