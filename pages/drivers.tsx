import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import Loading from '../components/Loading';
import Table from '../components/Table';
import { api } from '../utils/api';
import { GlobalContext } from '../utils/context';
import { formatName, dateFormatter, capitalizeFirstLetter } from '../utils/format';
import { TOKEN_NAME } from '../utils/values';
import { fadeVariants } from '../utils/variants';

interface Props {}

interface Driver {
	real_id: number;
	full_name: string;
	phone: string;
	email: string;
	trips: number;
	state: { name: string };
	city: { name: string };
	utility: string;
	vehicle: { vehicle_type: 'T' | 'U' };
	lastupdate: number;
	online: boolean;
	zero: boolean;
}

// @ts-ignore
const drivers: NextPage<Props> = (props: Props) => {
	const [drivers, setDrivers] = useState<Driver[]>();
	const [loading, setLoading] = useState(true);

	const { values, setGlobalValues } = useContext(GlobalContext);

	useEffect(() => {
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

			const res1 = await axios.get('https://api.sahla.xyz/api/v1/cities');

			const cities = res1.data.data;

			const res2 = await api.get('dash/drivers-data');

			const { online: onlineDrivers, lastupdate, positionZero } = res2.data;

			const res3 = await axios.get('https://api.sahla.xyz/api/v1/drivers-validated', { headers: { token: localStorage.getItem(TOKEN_NAME) ?? '' } });

			setDrivers(
				res3.data.data
					.filter((e: any) => !!e?.full_name)
					.map((driver: any) => ({
						...driver,
						full_name: formatName(driver.full_name),
						trips: parseInt(driver.trips_number) || 0,
						phone: '0' + driver.phone,
						city: cities.find((e: any) => e.id == driver.city_id),
						utility: driver?.vehicle?.vehicle_type == 'T' ? 'Touristique' : utilities?.find((e: any) => e.id == driver?.vehicle?.range_utility_id)?.name?.fr ?? 'U',
						online: onlineDrivers?.includes(driver.real_id),
						lastupdate: lastupdate.find((e: any) => e.key == driver.id)?.value ?? 0,
						zero: positionZero?.includes(driver.id?.toString()),
					}))
			);
			setTimeout(() => setLoading(false), 400);
		})();
	}, []);

	const titles = [
		{ name: 'ID', key: 'id' },
		{ name: 'Nom', key: 'name' },
		{ name: 'Numéro', key: 'phone' },
		{ name: 'Wilaya', key: 'wilaya' },
		{ name: 'Commune', key: 'city' },
		{ name: 'Type', key: 'type' },
		{ name: 'Courses', key: 'trips' },
		{ name: 'Vu', key: 'lastupdate' },
		{ name: 'Position (0,0)', key: 'zero' },
		{ name: 'En ligne', key: 'online' },
	];

	const sort = { clicked: false, desc: false };

	const sorting = {
		id: sort,
		name: sort,
		phone: sort,
		email: sort,
		wilaya: sort,
		city: sort,
		type: sort,
		trips: sort,
		lastupdate: sort,
		zero: sort,
		online: sort,
	};

	const elements = drivers?.map(driver => ({
		_id: driver.real_id,
		id: { text: driver.real_id.toString(), value: driver.real_id },
		name: { text: driver.full_name },
		phone: { text: driver.phone },
		wilaya: { text: driver.state.name },
		city: { text: driver.city.name },
		type: { text: driver?.utility },
		trips: { text: driver.trips },
		lastupdate: {
			text: capitalizeFirstLetter(driver.online ? 'En ligne' : driver.lastupdate == 0 ? 'Jamais' : dateFormatter.format(Math.ceil((-1 * (new Date().getTime() - new Date(driver.lastupdate).getTime())) / (1000 * 60 * 60 * 24)), 'days')).replace('Il y a 0 jour', "Aujourd'hui"),
			searchText: capitalizeFirstLetter(driver.online ? 'En ligne' : driver.lastupdate == 0 ? 'Jamais' : dateFormatter.format(Math.ceil((-1 * (new Date().getTime() - new Date(driver.lastupdate).getTime())) / (1000 * 60 * 60 * 24)), 'days')).replace('Il y a 0 jour', "Aujourd'hui"),
			value: driver.online ? Date.now() + 10 ** 5 : driver.lastupdate,
		},
		zero: { text: driver.zero ? <span className="bg-red-600 px-2 py-1 rounded-full">Oui</span> : 'Non', value: driver.zero ? 0 : 1, textToCopy: driver.zero ? 'Oui' : 'Non' },
		online: { text: <img className="!w-3 mx-auto" src={`/assets/${driver.online ? 'online' : 'offline'}.png`} />, value: driver.online ? 0 : 1 },
	}));

	const searchKeys = ['name', 'phone', 'trips', 'wilaya', 'city', 'type', 'lastupdate', 'online'];

	// const dropdown = [
	// 	{ name: 'Edit', onClick: () => {} },
	// 	{ name: 'Delete', textColor: 'text-danger-500', onClick: () => {} },
	// ];

	const keysNotToCopy = ['online', 'trips'];

	return (
		<>
			<Head>
				<title>Chauffeurs</title>
			</Head>

			<AnimatePresence exitBeforeEnter>
				{!elements && (
					<div className="h-screen flex justify-center items-center overflow-hidden py-2">
						<Loading showText={true} />
					</div>
				)}

				{!loading && (
					<motion.div variants={fadeVariants} className="flex flex-col justify-center items-center px-4 py-8">
						<Table
							key={drivers?.length}
							searchKeys={searchKeys}
							titles={titles}
							// @ts-ignore
							elements={elements}
							elementsPerPage={25}
							sorting={sorting}
							keysNotToCopy={keysNotToCopy}
							containerClass="w-full h-full"
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default drivers;
