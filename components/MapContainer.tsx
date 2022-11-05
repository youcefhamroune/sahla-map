import type { NextPage } from 'next';
import { MapContainer as Map, MapContainerProps } from 'react-leaflet';

const MapContainer: NextPage<MapContainerProps> = (props: MapContainerProps) => <Map {...props} />;

export default MapContainer;
