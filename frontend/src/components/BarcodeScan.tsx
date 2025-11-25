import { addItemByBarcode } from "@/services/apiItem";
import { useMutation } from "@tanstack/react-query";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { debounce } from "lodash";
import {
	useEffect,
	useMemo,
	useRef,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react";
import { toast } from "react-toastify";

function BarcodeScan({
	setForm,
	setOpen,
}: {
	setForm: Dispatch<
		SetStateAction<{
			name: string;
			organizationId: string;
			costPrice: number;
			sellingPrice: number;
			quantity: number;
			inventoryCategory: string;
			importance: "A" | "B" | "C";
			importedOn: Date;
			expiresOn?: Date;
			weight?: number;
			colour?: string;
			reorderLevel?: number;
			batchNumber?: number;
			origin?: string;
		}>
	>;
	setOpen: Dispatch<React.SetStateAction<boolean>>;
}) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [barcode, setBarcode] = useState("");
	const [cameraAccess, setCameraAccess] = useState<"granted" | "denied">(
		"granted"
	);

	const { mutate: addItemByBarcodeFn } = useMutation({
		mutationFn: addItemByBarcode,
		onSuccess: (data) => {
			toast.success("Item found successfully", { className: "toast" });
			setForm(
				(prev: {
					name: string;
					organizationId: string;
					costPrice: number;
					sellingPrice: number;
					quantity: number;
					inventoryCategory: string;
					importance: "A" | "B" | "C";
					importedOn: Date;
					expiresOn?: Date;
					weight?: number;
					colour?: string;
					reorderLevel?: number;
					batchNumber?: number;
					origin?: string;
				}) => {
					return { ...prev, ...data };
				}
			);
			console.log(data);
			setOpen(false);
		},
		onError: () => {
			toast.error("Item not found", { className: "toast" });
		},
	});

	const debouncedBarcode = useMemo(() => {
		return debounce(addItemByBarcodeFn, 5000);
	}, [addItemByBarcodeFn]) as ((searchTerm: string) => void) & {
		cancel: () => void;
	};

	useEffect(() => {
		async function checkAccess() {
			const res = await navigator.permissions.query({ name: "camera" });
			if (res.state === "prompt") {
				await navigator.mediaDevices.getUserMedia({ video: true });
			}
			setCameraAccess(res.state === "prompt" ? "denied" : "granted");
		}
		checkAccess();
	}, []);

	useEffect(() => {
		if (!barcode.length) {
			const codeReader = new BrowserMultiFormatReader();
			codeReader.decodeFromVideoDevice(
				undefined,
				videoRef.current as HTMLVideoElement,
				(result) => {
					if (result) {
						setBarcode(result.getText());
					}
				}
			);
		} else {
			debouncedBarcode(barcode);
		}
		return () => {
			debouncedBarcode.cancel();
		};
	}, [videoRef, debouncedBarcode, barcode]);

	return (
		<div className="flex flex-col items-center gap-2">
			{cameraAccess === "granted" ? (
				<video ref={videoRef} className="w-md aspect-video" />
			) : cameraAccess === "denied" ? (
				<div>Camera Access Denied</div>
			) : (
				<div>Prompt for access</div>
			)}
			<input
				type="text"
				name="barcode"
				id="barcode"
				value={barcode}
				placeholder="No barcode detected"
				onChange={(e) => setBarcode(e.target.value)}
				className="jet-brains tracking-wide"
			/>
		</div>
	);
}

export default BarcodeScan;
