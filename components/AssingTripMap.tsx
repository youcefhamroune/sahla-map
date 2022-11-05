import type { NextPage } from 'next';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { LatLngExpression, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Props {
	origin: LatLngExpression;
	setOrigin: React.Dispatch<React.SetStateAction<LatLngExpression>>;
	destination: LatLngExpression;
	setDestination: React.Dispatch<React.SetStateAction<LatLngExpression>>;
}

const AssignTripMap: NextPage<Props> = (props: Props) => {
	const mapRef = useRef<LeafletMap | null>(null);
	const originRef = useRef<L.Marker>(null);
	const destinationRef = useRef<L.Marker>(null);

	const eventHandlers = (type: string) =>
		useMemo(
			() => ({
				dragend() {
					const marker = (type == 'origin' ? originRef : destinationRef).current;
					marker && (type == 'origin' ? props.setOrigin([marker.getLatLng().lat, marker.getLatLng().lng]) : props.setDestination([marker.getLatLng().lat, marker.getLatLng().lng]));
				},
			}),
			[]
		);

	useEffect(() => {
		// console.log(originPopupRef.current);
		// originPopupRef.current?.openPopup();
		// destinationPopupRef.current?.openPopup();
	}, []);

	return (
		<MapContainer
			whenCreated={mapInstance => {
				mapRef.current = mapInstance;
			}}
			className="rounded-lg"
			center={props.origin}
			zoom={10}
			style={{ height: '60vh', width: '80%', zIndex: 1 }}
		>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<Marker draggable position={props.origin} ref={originRef} eventHandlers={eventHandlers('origin')}>
				<Popup>Départ</Popup>
			</Marker>
			<Marker draggable position={props.destination} icon={L.icon({ iconSize: [25, 41], iconAnchor: [2, 41], popupAnchor: [2, -40], iconUrl: '/marker-end.png' })} ref={destinationRef} eventHandlers={eventHandlers('destination')}>
				<Popup>Arrivée</Popup>
			</Marker>
			<Polyline weight={5} positions={[props.origin, props.destination]} />
		</MapContainer>
	);
};

export default AssignTripMap;
