import Avatar, { genConfig } from "react-nice-avatar";

interface UserAvatarProps {
	[key: string]: string | number | boolean | null | undefined;
	customSeed: string;
}

/**
 * @component a component to serve as a custom avatar specified by custom seed
 * @param {ComponentProps} props properties from parent including key for unique identification and custom seed of unique avatar
 * @author `Manas More`
 */
function UserAvatar(props: UserAvatarProps) {
	const config = genConfig(props.customSeed);
	return <Avatar {...config} {...props} />;
}
export default UserAvatar;
