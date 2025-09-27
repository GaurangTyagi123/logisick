importScripts(
	"https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);

if (workbox) {
	// Scripts & Styles
	workbox.routing.registerRoute(
		({ request }) =>
			request.destination === "script" || request.destination === "style",
		new workbox.strategies.NetworkFirst({
			cacheName: "static-resources",
		})
	);

	// Images
	workbox.routing.registerRoute(
		({ request }) => request.destination === "image",
		new workbox.strategies.CacheFirst({
			cacheName: "images",
			plugins: [
				new workbox.expiration.ExpirationPlugin({
					maxEntries: 100,
					maxAgeSeconds: 30 * 24 * 60 * 60,
				}),
			],
		})
	);

	// Fonts
	workbox.routing.registerRoute(
		({ request }) => request.destination === "font",
		new workbox.strategies.CacheFirst({
			cacheName: "fonts",
			plugins: [
				new workbox.expiration.ExpirationPlugin({
					maxEntries: 20,
					maxAgeSeconds: 365 * 24 * 60 * 60,
				}),
			],
		})
	);

	// HTML Pages (SPA routing)
	workbox.routing.registerRoute(
		({ request }) => request.mode === "navigate",
		new workbox.strategies.NetworkFirst({
			cacheName: "html-pages",
		})
	);
} else {
	console.log("Workbox didn't load");
}
