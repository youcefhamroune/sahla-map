import { formatTextForSearch } from './format';

export const TOKEN_NAME = 'TOKEN';

export const tripStatuses = {
	new: 'Commandée',
	refused: 'Refusée',
	accepted: 'Accepté',
	canceled: 'Annulée',
	in_progress: 'En cours',
	done: 'Terminée',
};

export const tripStatusColors = {
	new: 'bg-gray-400 text-black',
	accepted: 'bg-blue-600',
	refused: 'bg-red-500',
	canceled: 'bg-black',
	in_progress: 'bg-teal-400',
	done: 'bg-green-500',
};

export const driversIconValues = ['Touristique', 'Fourgonette', 'Fourgon', 'Dépanneuse', 'Pickup', 'Frigo', 'Plateau', 'Conteneur', 'A benne'];

export const getIconColor = (vehicleType?: string) => {
	vehicleType = formatTextForSearch(vehicleType?.replace('Fourgoun', 'Fourgon') || '');

	const values = driversIconValues.filter(e => e != 'Touristique').map(e => formatTextForSearch(e));

	if (vehicleType == 't') return 'driver-tour.png';

	for (const value of values) {
		if (vehicleType.includes(value)) return `driver-${value}.png`;
	}

	return 'driver-util.png';
};
