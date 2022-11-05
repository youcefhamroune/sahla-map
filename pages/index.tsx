import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import { Driver, RangeUtility } from '../utils/types';
import { AuthContext, GlobalContext, SocketContext } from '../utils/context';
import io from 'socket.io-client';
import { driversIconValues, TOKEN_NAME } from '../utils/values';
import { api } from '../utils/api';
import axios from 'axios';
import { formatName, formatTextForSearch } from '../utils/format';

const Home: NextPage = () => {
	const [drivers, setDrivers] = useState<Driver[]>();

	const { auth } = useContext(AuthContext);
	const { socket, setSocket } = useContext(SocketContext);
	const { setGlobalValues } = useContext(GlobalContext);

	const refresh = async () => {
		socket?.removeAllListeners();

		try {
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
		} catch (error) {
			//
		}

		try {
			const res = await axios.get(`https://api.sahla.xyz/api/v1/range-utility`);
			setGlobalValues(prev => ({ ...prev, utilities: res.data.map((e: any) => ({ id: e.id, name: e.name })) }));
		} catch (error) {
			//
		}
	};

	const Map: NextPage<{ drivers?: Driver[]; refresh: () => Promise<void> }> = dynamic(() => import('../components/Map'), { ssr: false });

	useEffect(() => {
		setSocket(io(process.env.NEXT_PUBLIC_API_URL!, { query: { token: localStorage.getItem(TOKEN_NAME) }, transports: ['websocket'] }));
		(async () => await refresh())();
	}, []);

	return (
		<div className={styles.container}>
			<Head>
				<title>Sahla Admin</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				{auth && (
					<>
						<Map drivers={drivers} refresh={refresh} />

						<div className="w-full flex flex-col gap-y-4 gap-x-16 p-4 lg:flex-row">
							<div className="w-full lg:w-1/2">
								{driversIconValues.map((e, index) => (
									<div key={index} className="flex items-center gap-x-4 my-1">
										<img className='w-7' src={`/assets/driver-${formatTextForSearch(e).replace('touristique', 'tour')}.png`} />
										<p>{e}</p>
									</div>
								))}
							</div>

							<div className="w-full lg:w-1/2">
								<h1 className="text-lg font-bold text-gray-400">{drivers?.filter(e => (e.position as [number, number])[0] == 0 && (e.position as [number, number])[1] == 0).length || 0} chauffeurs au point [0, 0]</h1>
								<ul className="list-disc ml-8">
									{drivers
										?.filter(e => (e.position as [number, number])[0] == 0 && (e.position as [number, number])[1] == 0)
										.map(driver => (
											<li key={driver.id}>
												{driver.name} - {driver.phone} ({driver.vehicleType})
											</li>
										))}
								</ul>
							</div>
						</div>
					</>
				)}
			</main>
		</div>
	);
};

export default Home;
