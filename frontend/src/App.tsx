import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import useModeStore from "@/stores/useModeStore";
import Loading from "./components/Loading";
import useCheckAuth from "@/hooks/user/useCheckAuth";

const Analytics = lazy(() => import("@/pages/Analytics"));
const UserManagement = lazy(() => import("@/pages/UserManagement"));
const ProductManagement = lazy(() => import("@/pages/ProductManagement"));
const OrderSales = lazy(() => import("@/pages/OrderSales"));
const ItemPage = lazy(() => import("@/pages/ItemPage"));
const AcceptInvite = lazy(() => import("@/pages/AcceptInvite"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Notfound = lazy(() => import("@/pages/NotFound"));
const Docs = lazy(() => import("@/pages/Docs"));

const Home = lazy(() => import("@/pages/Home"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Authenticate = lazy(() => import("@/pages/Authenticate"));
const Profile = lazy(() => import("@/pages/Profile"));
const Organization = lazy(() => import("@/pages/Organization"));
const OrgOverview = lazy(() => import("@/pages/OrgOverview"));

/**
 * @component a component to serves as base of all pages and handles routing of pages
 * @returns base app component
 */
function App() {
	const { getTheme, setMode } = useModeStore();
	const { user, isPending: isCheckingAuth } = useCheckAuth();

	useEffect(() => {
		setMode(getTheme());
	}, [getTheme, setMode]);

	if (isCheckingAuth) return <Loading fullscreen />;

	return (
		<>
			<Suspense fallback={<Loading fullscreen />}>
				<Routes>
					{/* path for homepage */}
					<Route index path="/" element={<Home />} />
					<Route
						path="/dashboard"
						element={
							user ? (
								<Organization />
							) : (
								<Navigate to={"/authenticate"} />
							)
						}
					/>
					{/* path for all/specific dashboard */}
					<Route
						path="/dashboard/:orgSlug"
						element={
							user ? (
								<Dashboard />
							) : (
								<Navigate to={"/authenticate"} />
							)
						}
					>
						<Route index element={<OrgOverview />} />
						<Route
							path="/dashboard/:orgSlug/analytics"
							element={<Analytics />}
						/>
						<Route
							path="/dashboard/:orgSlug/user-role"
							element={<UserManagement />}
						/>
						<Route
							path="/dashboard/:orgSlug/product-management"
							element={<ProductManagement />}
						/>
						<Route
							path="/dashboard/:orgSlug/order-sales"
							element={<OrderSales />}
						/>
					</Route>
					{/* path for invitation acceptence */}
					<Route
						path="/acceptInvite/:token"
						element={<AcceptInvite />}
					/>
					{/* path for uesr authentication */}
					<Route
						path="/authenticate"
						element={
							!user ? <Navigate to={"/"} /> : <Authenticate />
						}
					/>
					{/* path for default/specific user profile  */}
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
					{/* path to reset password of user who forgot thier's */}
					<Route
						path="/resetpassword/:resetToken"
						element={
							!user ? <Navigate to="/" /> : <ResetPassword />
						}
					/>
					{/* path for documentation */}
					<Route path="/documentation" element={<Docs />} />
					<Route path="/item/:orgSlug/:SKU" element={<ItemPage />} />
					{/* default path for paths that are not found/defined/allowed */}
					<Route path="*" element={<Notfound />} />
				</Routes>
			</Suspense>
			<ToastContainer
				position="top-left"
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
