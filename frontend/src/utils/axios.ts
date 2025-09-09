import axios from "axios";

/**
 * @objective instance of axios with presets to our backend API in development or production mdoe 
 */
const axinstance = axios.create({
	baseURL:
		import.meta.env.MODE === "development"
			? "http://localhost:8000/api"
			: "/api",
	withCredentials: true,
});
export default axinstance;
