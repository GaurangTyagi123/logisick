import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import useModeStore from "@/stores/useModeStore";
// import useAuthStore from "@/stores/useAuthStore";

import Loading from "@/components/Loading";

import useCheckAuth from "@/hooks/useCheckAuth";

import ResetPassword from "@/pages/ResetPassword";
import Notfound from "@/pages/Notfound";
import Docs from "@/pages/Docs";
const Home = lazy(() => import("@/pages/Home"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Authenticate = lazy(() => import("@/pages/Authenticate"));
const Profile = lazy(() => import("@/pages/Profile"));

function App() {
	const { getTheme, setMode } = useModeStore();
	const { user, isPending: isCheckingAuth } = useCheckAuth();

	useEffect(() => {
		setMode(getTheme());
	}, [getTheme, setMode]);

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
							!user ? <Navigate to={"/"} /> : <Authenticate />
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
						element={
							!user ? <Navigate to="/" /> : <ResetPassword />
						}
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
				toastStyle={{
					paddingBlock: "20px",
				}}
			/>
		</>
	);
}

export default App;
