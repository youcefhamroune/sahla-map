export const dateFormatter = new Intl.RelativeTimeFormat('fr');

export const capitalizeFirstLetter = (string = '') => string.charAt(0).toUpperCase() + string.slice(1);

export const formatName = (string = '') =>
	capitalizeFirstLetter(string)
		.replace('*', ' ')
		.replace(/\s+/g, ' ')
		.replace(/\b(\w)/g, (s: any) => s.toUpperCase())
		.trim();

export const minimizeAddress = (string = '') =>
	string
		.replace(/Daïra [a-zA-ZÀ-ÿ-. \s']+,/g, '')
		.replace(' de ', '')
		.replace(" d'", '')
		.replace(/,\s+\d+,/g, ',')
		.replace(/\s+/g, ' ')
		.split(',')
		.slice(-4, -1)
		.join(', ')
		.replace(/, \d+, Algérie/g, '')
		.replace(/\s+/g, ' ')
		.trim();

export const formatTextForSearch = (string: string) =>
	string
		.replace(/\s/g, '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
