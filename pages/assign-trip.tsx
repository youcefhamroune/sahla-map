import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { api } from '../utils/api';
import Alert from '../components/Alert';
import { AxiosError } from 'axios';

interface Props {}

const defaultOrigin: LatLngExpression = [36.75963, 2.963334];
const defaultDestination: LatLngExpression = [36.75103, 2.903334];
const defaultInfo = { driver: '', client: '', passengers: 1, type: 1 };

const assignTrip: NextPage<Props> = (props: Props) => {
	const [info, setInfo] = useState<typeof defaultInfo>(defaultInfo);
	const [origin, setOrigin] = useState<LatLngExpression>(defaultOrigin);
	const [destination, setDestination] = useState<LatLngExpression>(defaultDestination);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState({ message: '', err: false });

	const Map: NextPage<{
		origin: LatLngExpression;
		setOrigin: React.Dispatch<React.SetStateAction<LatLngExpression>>;
		destination: LatLngExpression;
		setDestination: React.Dispatch<React.SetStateAction<LatLngExpression>>;
	}> = dynamic(() => import('../components/AssingTripMap'), { ssr: false });

	const map = useMemo(() => <Map origin={origin} setOrigin={setOrigin} destination={destination} setDestination={setDestination} />, [origin, destination]);

	const validate = async () => {
		if (info.client.length < 9 || info.driver.length < 9) return;

		const data = { origin, destination, driverPhone: parseInt(info.driver).toString(), userPhone: parseInt(info.client).toString(), passengers: info.passengers, util: info.type == 0, range: info.type == 0 ? undefined : info.type };

		try {
			const res = await api.post('dash/assign-trip', data);

			if (res.data.success) {
				setAlertMessage({ message: 'Succès!', err: false });
				setOrigin(defaultOrigin);
				setDestination(defaultDestination);
				setInfo(defaultInfo);
			} else {
				let errMessage = '';
				if (res.data.err == 'client') errMessage = "Client n'existe pas!";
				else if (res.data.err == 'driver') errMessage = "Chauffeur n'existe pas!";
				else if (res.data.err?.includes('client-trip')) errMessage = 'Client déjà en course!';
				else if (res.data.err?.includes('driver-trip')) errMessage = 'Chauffeur déjà en course!';
				setAlertMessage({ message: errMessage, err: true });
				console.log(res.data);
			}
			setShowAlert(true);
		} catch (error: unknown | AxiosError) {
			setAlertMessage({ message: 'Erreur!', err: true });
			setShowAlert(true);
		}
	};

	return (
		<>
			<Head>
				<title>Attribuer Course</title>
			</Head>

			<div className="w-full h-full p-16">
				<div className="w-full h-full flex flex-col justify-center items-center gap-4">
					<div className="flex gap-x-4">
						<div className="flex space-x-2">
							<p className="my-auto">Client: </p>
							<input value={info.client} onChange={e => setInfo(prev => ({ ...prev, client: e.target.value || '' }))} type="text" className={`input${info.client.length < 9 ? ' invalid-input' : ''}`} placeholder="Numéro du client" />
						</div>
						<div className="flex space-x-2">
							<p className="my-auto">Chauffeur: </p>
							<input value={info.driver} onChange={e => setInfo(prev => ({ ...prev, driver: e.target.value || '' }))} type="text" className={`input${info.driver.length < 9 ? ' invalid-input' : ''}`} placeholder="Numéro du chauffeur" />
						</div>
					</div>
					<div className="flex gap-x-4">
						<div className="flex space-x-2">
							<p className="my-auto">Passagers: </p>
							<select className="select" onChange={e => setInfo(prev => ({ ...prev, passengers: parseInt(e.target.value) || 1 }))} value={info.passengers}>
								{info.type == 0 ? (
									<option value="1">-</option>
								) : (
									<>
										<option value="1">1</option>
										<option value="2">2</option>
										<option value="3">3</option>
										<option value="4">4</option>
									</>
								)}
							</select>
						</div>
						<div className="flex space-x-2">
							<p className="my-auto">Type: </p>
							<select className="select" onChange={e => setInfo(prev => ({ ...prev, type: parseInt(e.target.value) }))} value={info.type}>
								<option value="1">Économique</option>
								<option value="2">Space</option>
								<option value="3">Premium</option>
								<option value="0">Utilitaire</option>
							</select>
						</div>
					</div>
					{map}
					<button disabled={info.client.length < 9 || info.driver.length < 9} onClick={validate} className="bg-teal-500 rounded-full hover:bg-teal-600 main-transition px-8 py-2 disabled:opacity-75 disabled:hover:bg-gray-600 disabled:bg-gray-600">
						Valider
					</button>
				</div>
			</div>
			<Alert show={showAlert} setShow={setShowAlert} message={alertMessage.message} err={alertMessage.err} title={false} />
		</>
	);
};

export default assignTrip;
