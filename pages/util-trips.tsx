import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { LatLngExpression } from 'leaflet';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { api } from '../utils/api';
import { GlobalContext } from '../utils/context';
import { formatName, minimizeAddress } from '../utils/format';
import { PlusIcon, RefreshIcon } from '../utils/svg';
import { TripsMapProps } from '../utils/types';
import { tripStatusColors, tripStatuses } from '../utils/values';
import { fadeVariants } from '../utils/variants';

interface Props {}

interface Trip {
	id: number;
	client: string;
	driver: string;
	client_phone: string;
	driver_phone: string;
	clientStatus: string;
	driverStatus: string;
	adminStatus: string;
	admin_status: string;
	dep_address: string;
	des_address: string;
	receipt: number;
	created_at: Date;
	client_status: string;
	driver_status: string;
	origin: LatLngExpression;
	destination: LatLngExpression;
	range: string;
}

// @ts-ignore
const trips: NextPage<Props> = (props: Props) => {
	const [trips, setTrips] = useState<Trip[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [refresh, setRefresh] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [selectedTrip, setSelectedTrip] = useState<Trip>();
	const [copyText, setCopyText] = useState('');
	const [showCopy, setShowCopy] = useState(false);

	const { values, setGlobalValues } = useContext(GlobalContext);

	const TripsMap: NextPage<TripsMapProps> = dynamic(() => import('../components/TripsMap'), { ssr: false });

	useEffect(() => {
		setLoading(true);
		setTrips(null);

		(async () => {
			let utilities: any;

			if (!values?.utilities.length) {
				try {
					const res = await axios.get(`https://api.sahla.xyz/api/v1/range-utility`);
					utilities = res.data.map((e: any) => ({ id: e.id, name: e.name }));
					setGlobalValues(prev => ({ ...prev, utilities }));
				} catch {
					//
				}
			}

			const res = await api.get('dash/trips?hours=48&util=1');

			console.log(utilities);
			console.log(res.data[0]);

			setTrips(
				res.data
					.map((e: any) => ({
						...e,
						id: parseInt(e.id),
						client: formatName(e.client),
						driver: formatName(e.driver?.replace('*', ' ')),
						client_phone: '0' + e.client_phone,
						driver_phone: '0' + e.driver_phone,
						created_at: new Date(e.created_at),
						clientStatus: tripStatuses[e.client_status as keyof typeof tripStatuses],
						driverStatus: e.driver_status == 'new' ? 'Sonnée' : tripStatuses[e.driver_status as keyof typeof tripStatuses],
						adminStatus: !['new', 'refused', 'canceled'].includes(e.driver_status) && !['canceled'].includes(e.client_status) ? (e.admin_status == 'new' ? 'En attente' : tripStatuses[e.admin_status as keyof typeof tripStatuses]) : '-',
						origin: [parseFloat(e.dep_lat), parseFloat(e.dep_long)],
						destination: [parseFloat(e.des_lat), parseFloat(e.des_long)],
						range: utilities?.find((el: any) => el.id == parseInt(e?.range_id))?.name?.fr ?? 'U',
					}))
					.sort((a: any, b: any) => (a.created_at.getTime() < b.created_at.getTime() ? 1 : -1))
			);
			setTimeout(() => setLoading(false), 400);
		})();
	}, [refresh]);

	const showTrip = (trip: Trip) => {
		setSelectedTrip(trip);
		setShowModal(true);
	};

	const titles = [
		{ name: '-', key: 'details' },
		{ name: 'Date', key: 'date' },
		{ name: 'Client', key: 'client' },
		{ name: 'Status', key: 'clientStatus' },
		{ name: 'Chauffeur', key: 'driver' },
		{ name: 'Status', key: 'driverStatus' },
		{ name: 'Admin', key: 'adminStatus' },
		{ name: 'Type', key: 'type' },
		// { name: 'Prix', key: 'price' },
		{ name: 'De', key: 'from' },
		{ name: 'À', key: 'to' },
	];

	const sort = { clicked: false, desc: false };

	const sorting = {
		details: sort,
		client: sort,
		clientStatus: sort,
		driver: sort,
		driverStatus: sort,
		adminStatus: sort,
		from: sort,
		to: sort,
		// price: sort,
		type: sort,
		date: sort,
	};

	const elements = trips?.map(trip => ({
		_id: trip.id,
		details: {
			text: (
				<button className="p-2 bg-gray-500 border-2 border-gray-700 w-9 h-9 flex justify-center items-center rounded-full hover:bg-teal-600 main-transition" onClick={() => showTrip(trip)}>
					<PlusIcon className="!w-full !h-full" />
				</button>
			),
		},
		date: { text: trip.created_at.toLocaleString('fr').replace(' ', '\n') },
		client: { text: `${trip.client}\n${trip.client_phone}`, textToCopy: trip.client_phone },
		clientStatus: { text: <span className={tripStatusColors[trip.client_status as keyof typeof tripStatusColors] + ' rounded-lg px-2 py-1 text-xs'}>{trip.clientStatus}</span>, searchText: trip.clientStatus, textToCopy: trip.clientStatus },
		driver: { text: `${trip.driver}\n${trip.driver_phone}`, textToCopy: trip.driver_phone },
		driverStatus: { text: <span className={tripStatusColors[trip.driver_status as keyof typeof tripStatusColors] + ' rounded-lg px-2 py-1 text-xs'}>{trip.driverStatus}</span>, searchText: trip.driverStatus, textToCopy: trip.driverStatus },
		adminStatus: { text: <span className={(trip.adminStatus == '-' ? 'bg-gray-900' : trip.adminStatus == 'En attente' ? 'bg-yellow-500 text-black' : tripStatusColors[trip.admin_status as keyof typeof tripStatusColors]) + ' rounded-lg px-2 py-1'}>{trip.adminStatus}</span>, searchText: trip.adminStatus, textToCopy: trip.adminStatus },
		type: { text: trip.range },
		// price: { text: trip.receipt },
		from: { text: minimizeAddress(trip.dep_address) },
		to: { text: minimizeAddress(trip.des_address) },
	}));

	// const searchKeys = ['client', 'clientStatus', 'driver', 'driverStatus', 'from', 'to', 'price', 'date'];
	const searchKeys = ['client', 'clientStatus', 'driver', 'driverStatus', 'from', 'to', 'date', 'type'];

	// const dropdown = [
	// 	{ name: 'Edit', onClick: () => {} },
	// 	{ name: 'Delete', textColor: 'text-danger-500', onClick: () => {} },
	// ];

	const keysNotToCopy = ['details', 'from', 'to'];

	const copy = (text: any) => {
		if (text != undefined && String(text).length) {
			navigator.clipboard.writeText(text);
			setCopyText(text);
			setShowCopy(true);
		}
	};

	return (
		<>
			<Head>
				<title>Utilitaire</title>
			</Head>

			<AnimatePresence exitBeforeEnter>
				{loading && (
					<div className="h-screen flex justify-center items-center overflow-hidden py-2">
						<Loading showText={true} />
					</div>
				)}

				{!loading && (
					<motion.div variants={fadeVariants} className="flex flex-col justify-center items-center px-4 py-8">
						<div className="pb-4 flex items-center w-full">
							<span className="font-bold italic relative flex flex-1 grow px-4">Courses des 2 derniers jours seulement</span>
							<button onClick={() => setRefresh(prev => !prev)} className="bg-gray-700 rounded-full hover:bg-teal-600 main-transition p-2 w-8 h-8 flex items-center justify-center text-white">
								<RefreshIcon className="!w-4 !h-4" />
							</button>
						</div>

						<Table
							key={trips?.length}
							searchKeys={searchKeys}
							titles={titles}
							// @ts-ignore
							elements={elements}
							elementsPerPage={50}
							sorting={sorting}
							keysNotToCopy={keysNotToCopy}
							containerClass="w-full h-full"
						/>
					</motion.div>
				)}
			</AnimatePresence>
			<Modal modal="!w-3/4" show={showModal} setShow={setShowModal}>
				<div className="w-full h-full flex flex-col">
					<TripsMap start={selectedTrip?.origin} finish={selectedTrip?.destination} />
					<p className="text-center mt-2 font-bold">
						{selectedTrip?.created_at.toLocaleString('fr').replace(' ', '\n')} - {selectedTrip?.range}
					</p>
					<div className="px-4 py-1">
						<p>
							<span className="font-bold">Départ:</span> {selectedTrip?.dep_address}
						</p>
						<p>
							<span className="font-bold">Arrivée:</span> {selectedTrip?.des_address}
						</p>

						<div className="flex gap-x-4 my-3">
							<div className="w-2/3">
								<p>
									<span className="font-bold">Client:</span>{' '}
									<span className={`break-words px-2 py-1 rounded-xl main-transition hover:bg-gray-600 cursor-pointer active:bg-gray-700`} onClick={() => copy(selectedTrip?.client)}>
										{selectedTrip?.client}
									</span>{' '}
									<span className={`break-words px-2 py-1 rounded-xl main-transition hover:bg-gray-600 cursor-pointer active:bg-gray-700`} onClick={() => copy(selectedTrip?.client_phone)}>
										{selectedTrip?.client_phone}
									</span>{' '}
									{<span className={tripStatusColors[selectedTrip?.client_status as keyof typeof tripStatusColors] + ' rounded-lg px-2 py-1 mx-2 text-sm'}>{selectedTrip?.clientStatus}</span>}
								</p>
								<p className="my-3">
									<span className="font-bold">Chauffeur:</span>{' '}
									<span className={`break-words px-2 py-1 rounded-xl main-transition hover:bg-gray-600 cursor-pointer active:bg-gray-700`} onClick={() => copy(selectedTrip?.driver)}>
										{selectedTrip?.driver}
									</span>{' '}
									<span className={`break-words px-2 py-1 rounded-xl main-transition hover:bg-gray-600 cursor-pointer active:bg-gray-700`} onClick={() => copy(selectedTrip?.driver_phone)}>
										{selectedTrip?.driver_phone}
									</span>{' '}
									{<span className={tripStatusColors[selectedTrip?.driver_status as keyof typeof tripStatusColors] + ' rounded-lg px-2 py-1 mx-2 text-sm'}>{selectedTrip?.driverStatus}</span>}
								</p>
							</div>
							<div>
								<p>
									<span className="font-bold">Prix:</span>{' '}
									<span className={`break-words px-2 py-1 rounded-xl main-transition hover:bg-gray-600 cursor-pointer active:bg-gray-700`} onClick={() => copy(selectedTrip?.receipt)}>
										{selectedTrip?.receipt}
									</span>
								</p>
								<p className="my-3">
									<span className="font-bold">ID:</span>{' '}
									<span className={`break-words px-2 py-1 rounded-xl main-transition hover:bg-gray-600 cursor-pointer active:bg-gray-700`} onClick={() => copy(selectedTrip?.id)}>
										{selectedTrip?.id}
									</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</Modal>
			<Alert
				show={showCopy}
				setShow={setShowCopy}
				message={
					<span>
						<span className="font-bold">{copyText}</span> copié!
					</span>
				}
				title={false}
			/>
		</>
	);
};

export default trips;
