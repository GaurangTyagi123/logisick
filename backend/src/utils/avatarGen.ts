export function genProfileString(len: number) {
	const all = "abcdefghijklmnopqrstuvwxyzBCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let ret = "";
	for (let i = 0; i < len; i++) {
		ret += all[Math.floor(Math.random() * 62)];
	}
	return ret;
}
