import Avatar, { genConfig } from "react-nice-avatar";

interface UserAvatarProps {
	[key: string]: string | number | boolean | null | undefined;
	customSeed: string;
}

function UserAvatar(props: UserAvatarProps) {
	const config = genConfig(props.customSeed);
	return <Avatar {...config} {...props} />;
}
export default UserAvatar;
