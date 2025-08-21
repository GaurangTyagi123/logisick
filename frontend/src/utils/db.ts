import { openDB } from "idb";

const dbPromise = openDB("shade-db", 1, {
	upgrade(db) {
		if (!db.objectStoreNames.contains("notes"))
			db.createObjectStore("notes", { keyPath: "_id" });
		if (!db.objectStoreNames.contains("users"))
			db.createObjectStore("users", { keyPath: "id" });
	},
});

export const userDb = {
	async setUserMeta(user: User | null, isAuthenticated: boolean) {
		return (await dbPromise).put("users", {
			id: "auth",
			user,
			isAuthenticated,
		});
	},
	async getUserMeta(): Promise<{
		id: string;
		user: User;
		isAuthenticated: boolean;
	}> {
		return (await dbPromise).get("users", "auth");
	},
	async clearuserMeta(): Promise<void> {
		return (await dbPromise).delete("users", "auth");
	},
};
