import clsx from "clsx";

interface ModalProps {
	openModal: boolean;
	children: React.ReactNode;
}

/**
 * @component a component wrapper to convert them to modal
 * @param openModal boolean state to indicate weather modal is open or close 
 * @returns react component
 */
function Modal({ openModal, children }: ModalProps) {
	return (
		<div
			style={{ backgroundColor: "#00000088" }}
			className={clsx(
				"h-full w-full absolute place-items-center",
				openModal ? "grid" : "hidden"
			)}
		>
			{children}
		</div>
	);
}

export default Modal;
