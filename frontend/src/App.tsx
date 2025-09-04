import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import useModeStore from "./stores/useModeStore";
import Loading from "./components/loading";

import useAuthStore from "./stores/useAuthStore";

const Docs = lazy(() => import("./pages/docs"));
const Notfound = lazy(() => import("./pages/notfound"));
const ResetPassword = lazy(() => import("./pages/resetPassword"));
const Home = lazy(() => import("./pages/home"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Authenticate = lazy(() => import("./pages/authenticate"));
const Profile = lazy(() => import("./pages/profile"));

function App() {
	const { getTheme, setMode } = useModeStore();
	const { checkAuth, user, isCheckingAuth } = useAuthStore();

	useEffect(() => {
		setMode(getTheme());
	}, [getTheme, setMode]);

	useEffect(() => {
		async function authen() {
			console.log("checking auth");
			await checkAuth();
		}
		authen();
	}, [checkAuth]);

	if (isCheckingAuth) return <Loading />;

	return (
		<>
			<Suspense fallback={<Loading />}>
				<Routes>
					<Route index path="/" element={<Home />} />
					<Route
						path="/:orgId/dashboard"
						element={
							user ? (
								<Dashboard />
							) : (
								<Navigate to={"/authenticate"} />
							)
						}
					/>
					<Route
						path="/authenticate"
						element={
							user ? <Navigate to={"/"} /> : <Authenticate />
						}
					/>
					<Route
						path="/profile/:userId?"
						element={
							user ? (
								<Profile />
							) : (
								<Navigate to={"/authenticate"} />
							)
						}
					/>
					<Route
						path="/resetpassword/:resetToken"
						element={user ? <Navigate to="/" /> : <ResetPassword />}
					/>
					<Route path="/docs" element={<Docs />} />
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
