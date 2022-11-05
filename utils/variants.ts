export const fadeVariants = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
		transition: {
			duration: 0.7,
		},
	},
	exit: {
		opacity: 0,
		transition: {
			duration: 0.7,
		},
	},
};

export const alertVariants = {
	hidden: {
		opacity: 0,
		y: '100vh',
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			type: 'spring',
		},
	},
	exit: {
		opacity: 0,
		y: '-100vh',
	},
};

export const containerVariants = {
	hidden: {
		opacity: 0,
		y: '-100vh',
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.7,
			type: 'spring',
			damping: 15,
		},
	},
	exit: {
		opacity: 0,
		scale: 4,
		transition: {
			duration: 0.2,
		},
	},
};

export const xAxisVariants = {
	hidden: {
		opacity: 0,
		x: '-100vw',
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.5,
			type: 'spring',
		},
	},
	exit: {
		opacity: 0,
		x: '100vw',
		transition: {
			duration: 0.5,
			type: 'spring',
		},
	},
};
