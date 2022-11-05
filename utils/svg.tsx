interface Props {
	className?: string;
	transparent?: boolean;
	fill?: string;
}

export const ArrowUp = (props: Props) => (
	<svg className={props.className ? props.className : ''} version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="m4 12 1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
	</svg>
);

export const ArrowDown = (props: Props) => (
	<svg className={props.className ? props.className : ''} version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="m20 12-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
	</svg>
);

export const More = (props: Props) => (
	<svg className={props.className ? props.className : ''} version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>{' '}
	</svg>
);

export const PageFirst = (props: Props) => (
	<svg className={props.className ? props.className : ''} version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="M18.41 16.59 13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
	</svg>
);

export const PageLast = (props: Props) => (
	<svg className={props.className ? props.className : ''} version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
	</svg>
);

export const PageNext = (props: Props) => (
	<svg className={props.className ? props.className : ''} version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
	</svg>
);

export const PagePrev = (props: Props) => (
	<svg className={props.className ? props.className : ''} version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
	</svg>
);

export const MapIcon = (props: Props) => (
	<svg className={`!w-6 !h-6 ${props.className ? props.className : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
	</svg>
);

export const DriversIcon = (props: Props) => (
	<svg className={`!w-6 !h-6 ${props.className ? props.className : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
	</svg>
);

export const RefreshIcon = (props: Props) => (
	<svg className={`!w-6 !h-6 ${props.className ? props.className : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
	</svg>
);

export const CarIcon = (props: Props) => (
	<svg className={`!w-6 !h-6 ${props.className ? props.className : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path
			fill="#6b7280"
			ng-attr-d="{{icon.data}}"
			d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"
		></path>
	</svg>
);

export const TruckIcon = (props: Props) => (
	<svg className={`!w-6 !h-6 ${props.className ? props.className : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path
			fill="#6b7280"
			ng-attr-d="{{icon.data}}"
			d="M18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5M19.5,9.5L21.46,12H17V9.5M6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5M20,8H17V4H3C1.89,4 1,4.89 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8Z"
		></path>
	</svg>
);

export const Close: React.FC<Props & { onClick?: () => void }> = (props: Props & { onClick?: () => void }) => (
	<svg onClick={props.onClick} className={props.className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path fill={props.fill || 'currentColor'} d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
	</svg>
);

export const PlusIcon = (props: Props) => (
	<svg className={`!w-6 !h-6 ${props.className ? props.className : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
	</svg>
);

export const MobileIcon = (props: Props) => (
	<svg className={`!w-6 !h-6 ${props.className ? props.className : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
	</svg>
);

export const RoadIcon = (props: Props) => (
	<svg className={`!w-6 !h-6 ${props.className ? props.className : ''}`} fill="none" stroke="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
		<path d="M16,16L13,0H9v1H7V0H3L0,16h7v-4h2v4H16z M7,3h2v2H7V3z M7,10V7h2v3H7z" />
	</svg>
);

export const CashIcon = (props: Props) => (
	<svg className={`!w-6 !h-6 ${props.className ? props.className : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
	</svg>
);

export const LogoutIcon = (props: Props) => (
	<svg className={`!w-6 !h-6 ${props.className ? props.className : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
	</svg>
);
