import { useParams } from "react-router-dom";
import ItemCard from "@/components/ItemCard";
import Navbar from "@/components/Navbar";
import useGetItem from "@/hooks/item/useGetItem";
import Loading from "@/components/Loading";

function ItemPage() {
	const { SKU } = useParams();
	const { item, isPending } = useGetItem(SKU || '');
	if (isPending) return <Loading />

	return (
		<div className="flex flex-col gap-3 items-center bg-ls-bg-300 dark:bg-ls-bg-dark-800 min-h-screen">
			<Navbar hide={{ userButton: true }} />
			{item ? <ItemCard item={item} barebone small /> : <div>Not Item Found</div>}
		</div>
	);
}

export default ItemPage;
