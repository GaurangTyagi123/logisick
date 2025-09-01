importScripts(
	"https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);

if (workbox) {
	workbox.routing.registerRoute(
		({ request }) => request.destination === "image",
		new workbox.strategies.CacheFirst({
			cacheName: "image-cache",
			plugins: [
				new workbox.expiration.ExpirationPlugin({
					maxEntries: 50,
					maxAgeSeconds: 30 * 24 * 60 * 60,
				}),
			],
		})
	);
} else {
	console.log(`Workbox didn't load`);
}
