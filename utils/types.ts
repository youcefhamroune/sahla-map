import { LatLngExpression } from 'leaflet';

export type Driver = {
	id: number;
	name: string;
	phone: string;
	position: LatLngExpression;
	rating: number;
	range: number;
	vehicleType: 'U' | 'T';
};

export type RangeUtility = {
	id: number;
	name: {
		fr: string;
		ar: string;
		en: string;
	};
};

export type GlobalContextType = {
	utilities: RangeUtility[];
};

export type TripsMapProps = {
	start?: LatLngExpression;
	finish?: LatLngExpression;
};

export type Price = {
	_id: number;
	wilaya: string;
	base: number;
	kmprice: number;
	timeprice: number;
	discount: number;
	increase?: number | undefined;
	price2h?: number | undefined;
	price4h?: number | undefined;
	price8h?: number | undefined;
	provinceDiscount?: number | undefined;
};
