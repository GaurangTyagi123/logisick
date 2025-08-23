import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import useModeStore from "./stores/useModeStore";
import Loading from "./components/loading";

import Notfound from "./pages/notfound";
const Home = lazy(() => import("./pages/home"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Authenticate = lazy(() => import("./pages/authenticate"));
const Profile = lazy(() => import("./pages/profile"));

function App() {
	const { getTheme, setMode } = useModeStore();

	useEffect(() => {
		setMode(getTheme());
	}, [getTheme, setMode]);

	return (
		<>
			<Suspense fallback={<Loading />}>
				<Routes>
					<Route index path="/" element={<Home />} />
					<Route path="/:orgId/dashboard" element={<Dashboard />} />
					<Route path="/authenticate" element={<Authenticate />} />
					<Route path="/profile/:userId?" element={<Profile />} />
					<Route path="*" element={<Notfound />} />
				</Routes>
			</Suspense>
			<ToastContainer
				position="top-right"
				theme={getTheme()}
				limit={3}
				newestOnTop
			/>
		</>
	);
}

export default App;
