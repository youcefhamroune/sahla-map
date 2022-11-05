import type { NextPage } from 'next';
import { AnimatePresence, motion } from 'framer-motion';
import { Close } from '../utils/svg';
import styles from '../styles/Modal.module.css';

interface Props {
	children: React.ReactNode;
	show: boolean;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
	whenHide?: () => void;
	backdrop?: string;
	modal?: string;
}

const backdropVariants = {
	visible: {
		opacity: 1,
	},
	hidden: {
		opacity: 0,
	},
};

const modalVariants = {
	hidden: {
		opacity: 0,
		y: '-100vh',
	},
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			delay: 0.1,
			duration: 0.3,
			type: 'spring',
		},
	},
};

const Modal: NextPage<Props> = (props: Props) => {
	const hide = () => {
		props.setShow(false);
		props.whenHide && props.whenHide();
	};

	return (
		<AnimatePresence>
			{props.show && (
				<motion.div onMouseDown={e => (e.target == e.currentTarget ? hide() : null)} className={`${styles.backdrop} ${props.backdrop ?? ''}`} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden">
					<motion.div className={`${styles.modal} ${props.modal ?? ''}`} variants={modalVariants}>
						<Close onClick={hide} className="absolute top-2 right-2 h-5 w-5 cursor-pointer transition hover:text-emerald-500" />
						<div className="flex h-full w-full overflow-y-auto overflow-x-hidden">{props.children}</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
