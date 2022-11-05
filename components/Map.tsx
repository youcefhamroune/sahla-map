import type { NextPage } from 'next';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { LatLngExpression, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Driver } from '../utils/types';
import L from 'leaflet';
import Icon from './Icon';
import { renderToString } from 'react-dom/server';
import { useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext, SocketContext } from '../utils/context';
import { RefreshIcon } from '../utils/svg';
import { api } from '../utils/api';
import { formatName } from '../utils/format';
import { getIconColor } from '../utils/values';

interface Props {
	refresh: () => Promise<void>;
	drivers?: Driver[];
}

const defaultCenter: LatLngExpression = [36.75963, 2.963334];

const Map: NextPage<Props> = (props: Props) => {
	const [drivers, setDrivers] = useState<Driver[]>((props.drivers ?? []) as Driver[]);
	const [search, setSearch] = useState('');
	const [suggestions, setSuggestions] = useState<Driver[]>([]);

	const mapRef = useRef<LeafletMap | null>(null);

	const { socket } = useContext(SocketContext);

	const { values } = useContext(GlobalContext);

	// const leafletContext = useLeafletContext();

	useEffect(() => {
		// socket?.on('driver-position', (data: { driver: number; position: number[] }) => {
		// 	setDrivers(prev => prev?.map(e => (e.id == data.driver ? { ...e, position: data.position as LatLngExpression } : e)));
		// });

		// socket?.on('driver-connected', (data: Driver) => {
		// 	setDrivers(prev => {
		// 		if (prev.map(e => e.id).includes(data.id)) return prev;
		// 		return [...prev, { ...data, phone: '0' + data.phone }];
		// 	});
		// });

		// socket?.on('driver-disconnected', (data: number) => {
		// 	setDrivers(prev => prev.filter(e => e.id != data));
		// });

		const interval = setInterval(async () => {
			const res = await api.get(`dash/drivers`);

			setDrivers(
				res.data?.map((data: any) => ({
					id: data.value.id,
					name: formatName(data.value.name),
					phone: '0' + data.value.phone,
					position: data.value.position,
					rating: parseFloat(data.value.rating),
					range: data.value.range,
					vehicleType: data?.value?.vehicle?.vehicle_type ?? 'T',
				}))
			);
		}, 55000);

		return () => clearInterval(interval);
	}, []);

	const inputBlur = (element: HTMLElement, input?: HTMLInputElement) => {
		const onBlur = () => {
			setTimeout(() => {
				if (!(document.activeElement?.classList.contains('suggestion-item') || document.activeElement == (input ?? element))) {
					setSuggestions([]);
					element.removeEventListener('blur', onBlur);
				}
			}, 50);
		};
		element.addEventListener('blur', onBlur);
	};

	const openSuggestions = (input: EventTarget & HTMLInputElement) => setSuggestions(drivers);

	const inputOnClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
		openSuggestions(e.currentTarget);
		inputBlur(e.currentTarget);
	};

	const searchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
		setSuggestions(event.target.value.length > 0 ? drivers.filter(e => e.name.match(new RegExp(event.target.value, 'gi')) || e.phone.match(new RegExp(event.target.value, 'gi'))) : []);
	};

	const mod = (n: number, m: number) => ((n % m) + m) % m;

	const searchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const searchInput = e.currentTarget;

		if (e.key == 'Escape') return searchInput.blur();

		inputBlur(searchInput);

		if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
			e.preventDefault();

			if (searchInput.value.length == 0) openSuggestions(searchInput);

			if (searchInput.getAttribute('id') != 'client' && suggestions.length) {
				const suggestionElements = Array.from(document.querySelectorAll(`.${searchInput.getAttribute('id') == 'client' ? 'client-' : ''}suggestions .suggestion-item`)) as HTMLButtonElement[];

				suggestionElements[e.key == 'ArrowDown' ? 0 : suggestionElements.length - 1]?.focus();

				suggestionElements.forEach((element, idx) => {
					inputBlur(element, searchInput);
					element.addEventListener('keydown', event => {
						if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
							event.preventDefault();
							suggestionElements[mod(idx + (event.key == 'ArrowDown' ? 1 : -1), suggestionElements.length)].focus();
						} else if (event.key == 'Enter') {
							element.click();
						} else {
							searchInput.focus();
						}
					});
				});
			}
		}
	};

	const suggestionClick = (id: number) => () => {
		const map = mapRef.current;
		map?.setView((drivers.find(e => id == e.id)?.position ?? defaultCenter) as LatLngExpression, 16);
		setSuggestions([]);
	};

	return (
		<>
			<div className="mb-4 flex w-full">
				<div className="flex justify-center items-center w-1/4">
					<span className="text-3xl font-bold">{drivers?.length ?? 0}</span> <span className="mx-2">chauffeurs en ligne</span>
				</div>
				<div className="relative flex flex-1 grow px-4">
					<input className="input flex-grow" placeholder="Recherche" value={search} onClick={inputOnClick} onChange={searchChange} onKeyDown={searchKeyDown} autoFocus />
					{!!suggestions.length && (
						<div className="suggestions suggestion-list">
							{suggestions.map((s: any, idx: number) => (
								<button key={s.id} className="suggestion-item text-left" onClick={suggestionClick(s.id)}>
									{s.name} <span className="mx-2">|</span> {s.phone}
								</button>
							))}
						</div>
					)}
				</div>
				<button onClick={props.refresh} className="bg-gray-700 rounded-full hover:bg-teal-600 main-transition p-2 w-10 h-10 flex items-center justify-center text-white">
					<RefreshIcon className="!w-4 !h-4" />
				</button>
			</div>

			<MapContainer
				whenCreated={mapInstance => {
					mapRef.current = mapInstance;
				}}
				className="rounded-lg"
				center={defaultCenter}
				zoom={10}
				style={{ height: '80vh', width: '100%', zIndex: 1 }}
			>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				{drivers?.map(driver => (
					<Marker
						key={driver.id}
						icon={L.divIcon({
							className: '',
							html: renderToString(<Icon image={getIconColor((driver.vehicleType == 'T' ? 'T' : values?.utilities.find(e => e.id == driver.range)?.name?.fr))} />),
						})}
						position={driver.position}
					>
						<Popup>
							{driver.name} - {driver.phone} ({driver.vehicleType == 'T' ? 'T' : values?.utilities.find(e => e.id == driver.range)?.name?.fr})
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</>
	);
};

export default Map;
