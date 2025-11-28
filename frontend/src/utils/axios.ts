import axios from "axios";


let accessToken:string;
/**
 * @brief setter function toset csrf token
 * @param token csrf access token 
 * @author `Gaurang Tyagi`
 */
export const setAccessToken = (token:string) => {
	accessToken = token;
}

/**
 * @brief instance of axios with presets to our backend API in development or production mode
 * @author `Ravish Ranjan`
 */
const axinstance = axios.create({
	baseURL:
		import.meta.env.MODE === "development"
			? "http://localhost:8000/api"
			: "/api",
	withCredentials: true,
});

/**
 * @brief api request to get csrf token for user
 * @author `Gaurang Tygai`
 */
const getCSRFToken = async () => {
	try {
		const res = await axinstance.get('/v1/csrf-token');
		if (res.status === 200) {
			axinstance.defaults.headers['X-CSRF-Token'] = res.data.csrfToken;
		}
	}
	catch(err) {
		Promise.reject(err)
	}
}

await getCSRFToken();

// axios request interceptor to set access token in Authorization header
axinstance.interceptors.request.use((config) => {
	if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
	return config;
})
// axios interceptor to re-get the refresh token on expire
axinstance.interceptors.response.use((response: any) => response, async (error) => {
	const originalRequest = error.config;

	if (originalRequest.url.endsWith("login"))
		return Promise.reject(error)
	if (error.response.status === 401 && !originalRequest._retry) {
		originalRequest._retry = true;
		try {
			const refreshResponse = await axinstance.post('/v1/auth/refresh');
			const newAccessToken = refreshResponse.data.data.accessToken;
			setAccessToken(newAccessToken);

			originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
			return axinstance(originalRequest);
		}
		catch (refreshError) {
			window.location.href = '/authenticate';
			Promise.reject(refreshError)
		}
	}
	else
		return Promise.reject(error);
})
export default axinstance;
