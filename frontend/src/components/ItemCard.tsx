import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { H3, Large, Muted } from "./ui/Typography";
import Button from "./ui/button";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { Hint } from "@/assets/icons/Profilepage";

/**
 * @brief function to get difference between given date and current date
 * @param date date to get difference from
 * @returns {number} differnce of days between given date and current date
 */
function dateDifference(date: Date): number {
	const dateThen = new Date(date);
	const now = new Date();
	return Math.ceil(
		(dateThen.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
	);
}

/**
 * @brief function to display list item on item card
 * @param {string | number} field data
 * @param string fieldName name of field
 * @param string suffix? suffix at end
 * @param boolean small? is card small
 * @returns List item
 */
function ListItem({
	field,
	fieldName,
	suffix,
	small,
}: {
	field?: string | number;
	fieldName: string;
	suffix?: string;
	small?: boolean;
}) {
	return (
		<Large
			className={clsx(
				"flex justify-between items-center",
				small ? "text-sm" : "text-md"
			)}
		>
			<span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-4/10">
				{fieldName} :{" "}
			</span>
			<span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-4/10">
				{field || <Muted>NA</Muted>}
				{suffix}
			</span>
		</Large>
	);
}

/**
 *
 * @param string className? : to modify className from parent
 * @param Item item : item data
 * @param boolean small? : to keep small size
 * @param boolean barebone? : to show only small set of data
 * @returns
 */
function ItemCard({
	className,
	item,
	small,
	barebone = false,
	viewMorePath,
}: {
	item: Item;
	barebone?: boolean;
	small?: boolean;
	className?: string;
	viewMorePath?: string;
}) {
	const [showQr, setShowQr] = useState<boolean>(false);

	return (
		<div
			className={clsx(
				"relative duration-100 aspect-square transform-3d shadow-2xl",
				showQr ? "rotate-y-180" : "rotate-y-0",
				small ? "w-xs" : "w-md",
				className
			)}
		>
			{/* Qrcode card */}
			<Card
				className={clsx(
					"h-full w-full flex flex-col justify-center items-center p-4 gap-2 absolute top-0 left-0 rotate-y-180",
					showQr ? "z-20" : "z-0"
				)}
			>
				<CardHeader className="w-full text-center">
					<H3 className="jet-brains">Scan Me</H3>
				</CardHeader>
				<CardContent
					className={clsx(
						"flex flex-col justify-between",
						small ? "h-60 w-60" : "h-90 w-90"
					)}
				>
					<img
						src={`https://encode.ravishdev.org/api/create/text_url?text_url=${process.env.FRONTEND_URL}/item/${item?.SKU}&fg=%2368a872&bg=%230e2033`}
						alt={item?.name.substring(0, 10)}
						className="w-full rounded-2xl"
					/>
				</CardContent>
				<CardFooter className="w-full px-0">
					<Button onClick={() => setShowQr(false)} className="w-full">
						Show Information
					</Button>
				</CardFooter>
			</Card>
			{/* seperator card */}
			<div className="h-full w-full bg-ls-bg-300 dark:bg-ls-bg-dark-800 rounded-2xl"></div>
			{/* Information Card */}
			<Card
				className={clsx(
					"h-full w-full flex flex-col justify-between p-4 absolute top-0 left-0 gap-2",
					showQr ? "z-0" : "z-20"
				)}
			>
				<CardHeader className="w-full h-min ">
					<H3 className="text-center jet-brains">
						{item?.SKU?.substring(25)}
					</H3>
					{item.expiresOn && dateDifference(item.expiresOn) <= 15 && (
						<div
							className={clsx(
								"bg-ls-sec-400 dark:bg-ls-sec-900 rounded-lg w-full flex items-center justify-center gap-1 jet-brains",
								small ? "p-1 text-sm" : "p-1 text-md"
							)}
						>
							<Hint /> item exipres in{" "}
							{dateDifference(item.expiresOn)} days
						</div>
					)}
				</CardHeader>
				<CardContent className="w-full h-full gap-2 flex flex-col overflow-y-auto p-4 rounded-2xl">
					<ListItem
						small={small}
						field={item.name}
						fieldName="Name"
					/>
					{!small && <Separator />}
					<ListItem
						small={small}
						field={item.inventoryCategory}
						fieldName="Category"
					/>
					{!small && <Separator />}
					<ListItem
						small={small}
						field={item.origin}
						fieldName="Origin"
					/>
					{item?.expiresOn && (
						<>
							{!small && <Separator />}
							<ListItem
								small={small}
								field={new Date(
									item.expiresOn
								).toLocaleDateString()}
								fieldName="Expires On"
							/>
						</>
					)}
					{!barebone && (
						<>
							{!small && <Separator />}
							<ListItem
								small={small}
								field={item.costPrice}
								fieldName="Cost Price"
								suffix=" /-"
							/>
							{!small && <Separator />}
							<ListItem
								small={small}
								field={item.sellingPrice}
								fieldName="Selling Price"
								suffix=" /-"
							/>
							{!small && <Separator />}
							<ListItem
								small={small}
								field={item.quantity}
								fieldName="Quantity"
								suffix=" units"
							/>
							{!small && <Separator />}
							<ListItem
								small={small}
								field={new Date(
									item.importedOn
								).toLocaleDateString()}
								fieldName="Imported On"
							/>
							{!small && <Separator />}
							<ListItem
								small={small}
								field={item.colour}
								fieldName="Colour"
							/>
							{!small && <Separator />}
							<ListItem
								small={small}
								field={item.weight}
								fieldName="Weight"
							/>
							{!small && <Separator />}
							<ListItem
								small={small}
								field={item.importance}
								fieldName="Importance"
							/>
							{!small && <Separator />}
							<ListItem
								small={small}
								field={item.reorderLevel}
								fieldName="Reorder Level"
							/>
						</>
					)}
				</CardContent>
				<CardFooter className="w-full flex flex-col justify-between px-0 gap-2">
					<div className="w-full grid grid-cols-2 gap-2">
						<Button
							onClick={() => setShowQr(true)}
							className="w-full"
						>
							Show Qrcode
						</Button>
						<Link
							to={viewMorePath || "/authenticate"}
							className="w-full"
						>
							<Button className="w-full">View More</Button>
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}

export default ItemCard;
