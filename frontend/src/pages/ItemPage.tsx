import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axinstance from "@/utils/axios";
import { handleError } from "@/utils/handleError";
import ItemCard from "@/components/ItemCard";
import Navbar from "@/components/Navbar";

function ItemPage() {
	const { SKU } = useParams();
	const [item, setItem] = useState<Item | null>(null);

	useEffect(() => {
		const fetchItem = async (SKU: string) => {
			try {
				const res = await axinstance.get(`/v1/item/${SKU}`);
				if (res.status === 200) {
					const data = res.data.data.item;
					setItem(data);
				}
			} catch (err) {
				handleError(err);
			}
		};
		fetchItem(SKU as string);
	}, [SKU]);

	return (
		<div className="flex flex-col gap-3 items-center bg-ls-bg-300 dark:bg-ls-bg-dark-800 min-h-screen">
			<Navbar hide={{ userButton: true }} />
			{item ? <ItemCard item={item} small barebone/> : <div>Not Item Found</div>}
		</div>
	);
}

export default ItemPage;
