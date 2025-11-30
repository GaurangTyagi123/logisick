import { useState } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { H3, Muted } from "@/components/ui/Typography";
import Button from "@/components/ui/button";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Hint } from "@/assets/icons/Profilepage";
import {
	dateDifference,
	formatCurrency,
	prefereableUnits,
} from "@/utils/utilfn";

/**
 * @componenet compoenent to be used as list item for the item card
 * @param {string | number} field data
 * @param {string} fieldName name of field
 * @param {string} suffix suffix at end
 * @param {boolean} small is card small
 * @author `Ravish Ranjan`
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
		<div
			className={clsx(
				"flex justify-between items-center",
				small ? "text-xs" : "text-sm"
			)}
		>
			<span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-4/10">
				{fieldName} :{" "}
			</span>
			<span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-4/10">
				{field || <Muted>NA</Muted>}
				{suffix}
			</span>
		</div>
	);
}

/**
 * @component lable to tell hte expiration status of item
 * @param {boolean} small to keep small size
 * @param {boolean} barebone to show only small set of data
 * @author `Ravish Ranjan`
 */
function ItemExpireLabel({
	small,
	expiresOn,
}: {
	small?: boolean;
	expiresOn: Date;
}) {
	const leftDate = dateDifference(expiresOn);
	console.log("left days", leftDate);
	return (
		<div
			className={clsx(
				"bg-ls-sec-400 dark:bg-ls-sec-900 rounded-lg w-full flex items-center justify-center gap-1 jet-brains",
				small ? "p-1 text-sm" : "p-1 text-md"
			)}
		>
			{leftDate <= 15 && leftDate >= 0 ? (
				<>
					<Hint /> item exipres in {leftDate} days
				</>
			) : (
				<>
					<Hint /> item expired
				</>
			)}
		</div>
	);
}

/**
 * @component componenet to be used as item card
 * @param {string} className to modify className from parent
 * @param {Item} item item data
 * @param {boolean} small to keep small size
 * @param {boolean} barebone to show only small set of data
 * @author `Ravish Ranjan`
 */
function ItemCard({
	className,
	item,
	orgSlug,
	small,
	barebone = false,
	viewMorePath,
}: {
	item: Item;
	orgSlug: string;
	barebone?: boolean;
	small?: boolean;
	className?: string;
	viewMorePath?: string;
}) {
	const [showQr, setShowQr] = useState<boolean>(false);

	return (
		<div
			className={clsx(
				"aspect-square w-2xs sm:w-xs md:w-sm max-w-11/12 outline-none duration-1000 [perspective:10rem] transform-3d",
				showQr && "[transform:rotateY(180deg)]",
				small ? "max-w-xs" : "max-w-md",
				className
			)}
		>
			{/* Information Card */}
			<Card className="inset-0 p-2 md:p-4 gap-2 absolute [backface-visibility:hidden]">
				<CardHeader className="w-full h-min ">
					<H3 className="text-center jet-brains">
						{item?.SKU?.substring(25)}
					</H3>
					{item.expiresOn && (
						<ItemExpireLabel
							expiresOn={item.expiresOn}
							small={small}
						/>
					)}
				</CardHeader>
				<CardContent className="w-full h-90 gap-2 grid overflow-y-auto scrollbar p-2 md:p-4 rounded-2xl">
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
					{!small && <Separator />}
					<ListItem
						small={small}
						field={
							item?.expiresOn
								? new Date(item?.expiresOn).toLocaleDateString()
								: ""
						}
						fieldName="Expires On"
					/>
					{!barebone && (
						<>
							{!small && <Separator />}
							<ListItem
								small={small}
								field={formatCurrency(item.costPrice)}
								fieldName="Cost Price"
								suffix=" /-"
							/>
							{!small && <Separator />}
							<ListItem
								small={small}
								field={formatCurrency(item.sellingPrice)}
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
								field={
									item.weight && prefereableUnits(item.weight)
								}
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
							{!small && <Separator />}
							<ListItem
								small={small}
								field={item.batchNumber}
								fieldName="Batch Number"
							/>
						</>
					)}
				</CardContent>
				<CardFooter className="grid grid-cols-2 gap-1 p-0 md:p-0">
					<Button
						onClick={() => setShowQr(true)}
						className="col-span-1 w-full"
						size={"sm"}
					>
						Show Qrcode
					</Button>
					<Link
						to={viewMorePath || "/authenticate"}
						className="col-span-1"
					>
						<Button className="w-full" size={"sm"}>
							More{" "}
							<span className="hidden sm:flex">About Item</span>
						</Button>
					</Link>
				</CardFooter>
			</Card>
			{/* Qrcode card */}
			<Card className="inset-0 size-full p-2 md:p-4 gap-2 absolute [backface-visibility:hidden] [transform:rotateY(180deg)]">
				<CardHeader className="w-full text-center">
					<H3 className="jet-brains">Scan Me</H3>
				</CardHeader>
				<CardContent className="grid place-items-center">
					<img
						src={`https://encode.ravishdev.org/api/create/text_url?text_url=${
							import.meta.env.VITE_FRONTEND_URL ||
							window.location.origin ||
							"http://localhost:5173"
						}/item/${orgSlug}/${
							item?.SKU
						}&fg=%2368a872&bg=%230e2033`}
						alt={item?.name.substring(0, 10)}
						className="rounded-2xl md:max-w-10/12 max-w-2/3"
					/>
				</CardContent>
				<CardFooter className="w-full p-0 md:p-0">
					<Button onClick={() => setShowQr(false)} className="w-full">
						Show Information
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

export default ItemCard;
