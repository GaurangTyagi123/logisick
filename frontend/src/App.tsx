import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import useModeStore from "@/stores/useModeStore";
// import useAuthStore from "@/stores/useAuthStore";

import useCheckAuth from "@/hooks/useCheckAuth";
import Analytics from "./pages/Analytics";
import UserManagement from "./pages/UserManagement";
import ProductManagement from "./pages/ProductManagement";
import OrderSales from "./pages/OrderSales";
import OrgOverview from "./pages/OrgOverview";
import { faker } from "@faker-js/faker";
import Organiztion from "./pages/Organization";

const Loading = lazy(() => import("@/components/Loading"));

const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Notfound = lazy(() => import("@/pages/NotFound"));
const Docs = lazy(() => import("@/pages/Docs"));

const Home = lazy(() => import("@/pages/Home"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Authenticate = lazy(() => import("@/pages/Authenticate"));
const Profile = lazy(() => import("@/pages/Profile"));

const data = [
	{
		id: String(faker.number.bigInt()),
		name: faker.company.name(),
		catchPhrase: faker.company.buzzPhrase(),
		type: faker.company.buzzNoun(),
		description: faker.lorem.paragraph(),
	},
	{
		id: String(faker.number.bigInt()),
		name: faker.company.name(),
		catchPhrase: faker.company.buzzPhrase(),
		type: faker.company.buzzNoun(),
		description: faker.lorem.paragraph(),
	},
	{
		id: String(faker.number.bigInt()),
		name: faker.company.name(),
		catchPhrase: faker.company.buzzPhrase(),
		type: faker.company.buzzNoun(),
		description: faker.lorem.paragraph(),
	},
	{
		id: String(faker.number.bigInt()),
		name: faker.company.name(),
		catchPhrase: faker.company.buzzPhrase(),
		type: faker.company.buzzNoun(),
		description: faker.lorem.paragraph(),
	},
];

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

	if (isCheckingAuth) return <Loading />;

	return (
		<>
			<Suspense fallback={<Loading />}>
				<Routes>
					{/* path for homepage */}
					<Route index path="/" element={<Home />} />
					<Route
						path="/organizations"
						element={
							user ? (
								<Organiztion data={data} />
							) : (
								<Navigate to={"/authenticate"} />
							)
						}
					/>
					{/* path for all/specific dashboard */}
					<Route
						path="/dashboard/:orgId"
						element={
							user ? (
								<Dashboard />
							) : (
								<Navigate to={"/authenticate"} />
							)
						}
					>
						<Route index element={<OrgOverview data={data} />} />
						<Route
							path="/dashboard/:orgId/analytics"
							element={<Analytics />}
						/>
						<Route
							path="/dashboard/:orgId/user-role"
							element={<UserManagement />}
						/>
						<Route
							path="/dashboard/:orgId/product-management"
							element={<ProductManagement />}
						/>
						<Route
							path="/dashboard/:orgId/order-sales"
							element={<OrderSales />}
						/>
					</Route>
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
					<Route path="/docs" element={<Docs />} />
					{/* default path for paths that are not found/defined/allowed */}
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
