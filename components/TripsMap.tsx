import { LatLngExpression } from 'leaflet';
import type { NextPage } from 'next';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { TripsMapProps } from '../utils/types';
import { renderToString } from 'react-dom/server';
import Icon from './Icon';
import L from 'leaflet';

const TripsMap: NextPage<TripsMapProps> = (props: TripsMapProps) => {
	return (
		<>
			{!!props.start && !!props.finish && (
				<MapContainer bounds={L.latLngBounds([props.start, props.finish])} className="rounded-lg border-2 border-gray-700 w-full h-96" center={props.start}>
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					{!!props.start && (
						<Marker
							icon={L.divIcon({
								className: '',
								html: renderToString(<Icon image="start.png" className="!w-16" />),
							})}
							position={props.start}
						></Marker>
					)}
					{!!props.finish && (
						<Marker
							icon={L.divIcon({
								className: '',
								html: renderToString(<Icon image="finish.png" className="!w-16" />),
							})}
							position={props.finish}
						></Marker>
					)}
					{!!props.start && !!props.finish && <Polyline weight={7} positions={[props.start, props.finish]} />}
				</MapContainer>
			)}
		</>
	);
};

export default TripsMap;
