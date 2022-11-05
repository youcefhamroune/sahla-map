import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { containerVariants, xAxisVariants } from '../utils/variants';

interface Props {
	showText?: boolean;
}

const variants = {
	...{ ...containerVariants, visible: { ...containerVariants.visible, transition: { ...containerVariants.visible.transition, damping: 10 } } },
	exit: {
		opacity: 0,
		scale: 20,
		transition: {
			duration: 0.2,
		},
	},
};

const imgVariants = {
	move: {
		y: 0,
		x: [0, 0, 0, 5, -5, 5, -5, 5, 0, 0, 0],
		transition: {
			yoyo: Infinity,
			duration: 1.5,
		},
	},
};

const Loading: React.FC<Props> = (props: Props) => {
	const [initial, setInitial] = useState(true);

	useEffect(() => {
		let mounted = true;
		setTimeout(() => mounted && setInitial(false), 1000);
		return () => {
			mounted = false;
		};
	}, []);

	return (
		<motion.div className="h-full flex" variants={variants} initial="hidden" animate="visible" exit="exit">
			<div className="m-auto">
				<motion.img className="w-32 mb-5" variants={imgVariants} animate={initial || !props.showText ? 'visible' : 'move'} src='/assets/logo.png' />
				<div className="h-10">
					<AnimatePresence>
						{initial ||
							(props.showText && (
								<motion.p className="text-center text-xl flex justify-center" variants={xAxisVariants} initial="hidden" animate="visible" exit="exit">
									Loading
								</motion.p>
							))}
					</AnimatePresence>
				</div>
			</div>
		</motion.div>
	);
};

export default Loading;
