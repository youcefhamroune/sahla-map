import { CarIcon, CashIcon, DriversIcon, LogoutIcon, MapIcon, MobileIcon, RoadIcon, TruckIcon } from './svg';

export const sidebarElements = (high: boolean) => [
	{ text: 'Map', href: '/', icon: MapIcon },
	{ text: 'Chauffeurs', href: '/drivers', icon: DriversIcon },
	{ text: 'Courses Touristiques', href: '/trips', icon: CarIcon },
	{ text: 'Courses Utilitaires', href: '/util-trips', icon: TruckIcon },
	{ text: 'OTP', href: '/otp', icon: MobileIcon },
	{ text: 'Attribuer Course', href: '/assign-trip', icon: RoadIcon },
	...(high ? [{ text: 'Prix', href: '/prices', icon: CashIcon }] : []),
	{ text: 'Se déconnecter', href: '/logout', icon: LogoutIcon },
];
