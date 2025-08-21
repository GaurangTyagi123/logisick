import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Home = lazy(() => import("./pages/home"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Authenticate = lazy(() => import("./pages/authenticate"));
const Notfound = lazy(() => import("./pages/notfound"));
const Profile = lazy(() => import("./pages/profile"));

function App() {
	return (
		<div className="h-full w-full">
			<Suspense fallback={<div>...</div>}>
				<Routes>
					<Route index path="/" element={<Home />} />
					<Route path="/:orgId/dashboard" element={<Dashboard />} />
					<Route path="/authenticate" element={<Authenticate />} />
					<Route path="/profile/:userId?" element={<Profile/>}/>
					<Route path="*" element={<Notfound />} />
				</Routes>
			</Suspense>
		</div>
	);
}

export default App;
