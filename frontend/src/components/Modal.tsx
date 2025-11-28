import clsx from "clsx";
import { Suspense } from "react";
import Loading from "@/components/Loading";
interface ModalProps {
	openModal: boolean;
	children: React.ReactNode;
}

/**
 * @component a component wrapper to convert them to modal
 * @param {boolean} openModal state to indicate weather modal is open or close
 * @author `Ravish Ranjan`
 */
function Modal({ openModal, children }: ModalProps) {
	return (
		<div
			style={{ backgroundColor: "#00000088" }}
			className={clsx(
				"h-full w-full absolute top-0 left-0 justify-center items-start pt-10 sm:pt-20 z-50",
				openModal ? "flex" : "hidden"
			)}
		>
			<Suspense fallback={<Loading />}>{children}</Suspense>
		</div>
	);
}

export default Modal;
