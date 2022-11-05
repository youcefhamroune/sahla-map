import { alertVariants, fadeVariants } from '../utils/variants';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { NextPage } from 'next';
import styles from '../styles/Alert.module.css';

interface Props {
	setShow: (show: boolean) => void;
	show?: boolean;
	title?: string | boolean;
	message?: string | JSX.Element;
	className?: string;
	fade?: boolean;
	duration?: number;
	center?: boolean;
	err?: boolean;
	slow?: true;
}

export type AlertState = Omit<Props, 'setShow'>;

const Alert: NextPage<Props> = (props: Props) => {
	let mounted = true;
	useEffect(() => {
		if (props.show) {
			setTimeout(() => {
				mounted && props.setShow(false);
			}, props.duration || (props.slow ? 7500 : 2500));
		}
		return () => {
			mounted = false;
		};
	}, [props.show]);

	return (
		<AnimatePresence>
			{props.show && (
				// @ts-ignore
				<motion.div variants={props.fade ? fadeVariants : alertVariants} initial="hidden" animate="visible" exit="exit" className={`${styles[props.className] ?? props.err ? styles.red : styles.teal} ${styles.alert} ${props.center == false ? 'left-10' : 'inset-x-0 md:mx-auto'}`} role="alert">
					{props.title !== false && <strong className="font-bold">{props.title ?? 'Error !'} </strong>}
					{!!props.message && <span>{props.message}</span>}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Alert;
