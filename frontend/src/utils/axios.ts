import axios from "axios";

const axinstance = axios.create({
	baseURL:
		import.meta.env.MODE === "development"
			? "http://localhost:8000/api"
			: "/api",
	withCredentials: true,
});
export default axinstance;
