import { AnimatePresence, motion } from 'framer-motion';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { api } from '../utils/api';
import { AuthContext } from '../utils/context';
import { Price } from '../utils/types';
import { fadeVariants } from '../utils/variants';

interface Props {}

const prices: NextPage<Props> = (props: Props) => {
	const [prices, setPrices] = useState<Price[]>();
	const [loading, setLoading] = useState(true);
	const [selectedPrice, setSelectedPrice] = useState<Price>();
	const [showModal, setShowModal] = useState(false);
	const [changeThisToReload, setReload] = useState(true);

	const router = useRouter();
	const { high } = useContext(AuthContext);

	useEffect(() => {
		setLoading(true);
		setPrices([]);

		if (!high) {
			router.push('/');
			return;
		}

		(async () => {
			const res = await api.get('/dash/prices');
			console.log(res.data);
			setPrices(res.data);

			setTimeout(() => setLoading(false), 500);
		})();
	}, [changeThisToReload]);

	const titles = [
		{ name: 'ID', key: 'id' },
		{ name: 'Wilaya', key: 'wilaya' },
		{ name: 'Base', key: 'base' },
		{ name: 'Remise Wilaya', key: 'provinceDiscount' },
		{ name: 'Prix KM', key: 'kmprice' },
		{ name: 'Prix Minute', key: 'timeprice' },
		{ name: 'Remise', key: 'discount' },
		{ name: '2H', key: 'price2h' },
		{ name: '4H', key: 'price4h' },
		{ name: '8H', key: 'price8h' },
		{ name: 'Augmentation', key: 'increase' },
	];

	const sort = { clicked: false, desc: false };

	const sorting = {
		id: sort,
		wilaya: sort,
		base: sort,
		kmprice: sort,
		timeprice: sort,
		discount: sort,
		increase: sort,
		price2h: sort,
		price4h: sort,
		price8h: sort,
		provinceDiscount: sort,
	};

	const elements = prices
		?.sort((a, b) => (a._id > b._id ? 1 : -1))
		?.map(price => ({
			_id: price._id,
			id: { text: price._id.toString().padStart(2, '0'), value: price._id },
			wilaya: { text: price.wilaya },
			base: { text: price.base },
			provinceDiscount: { text: price._id == 0 ? '-' : price.provinceDiscount + '%', value: price.provinceDiscount },
			kmprice: { text: price._id == 0 ? price.kmprice : '-' },
			timeprice: { text: price._id == 0 ? price.timeprice : '-' },
			discount: { text: price._id == 0 ? price.discount : '-' },
			price2h: { text: price._id == 0 ? price.price2h : '-' },
			price4h: { text: price._id == 0 ? price.price4h : '-' },
			price8h: { text: price._id == 0 ? price.price8h : '-' },
			increase: { text: price._id == 0 ? price.increase : '-' },
		}));

	const searchKeys = ['id', 'wilaya', 'base', 'kmprice', 'timeprice', 'discount', 'increase', 'price2h', 'price4h', 'price8h', 'provinceDiscount'];

	const keysNotToCopy: any[] = [];

	const dropdown = [
		{
			name: 'Éditer',
			onClick: (id: number) => {
				setSelectedPrice(prices?.find(e => e._id == id));
				setShowModal(true);
			},
		},
	];

	const validate = (price: Price) => async () => {
		const res = await api.post('dash/update-price', { price });
		setShowModal(false);
		setReload(prev => !prev);
	};

	return (
		<>
			<Head>
				<title>Prix</title>
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
							key={prices?.length}
							searchKeys={searchKeys}
							titles={titles}
							// @ts-ignore
							elements={elements}
							elementsPerPage={100}
							sorting={sorting}
							keysNotToCopy={keysNotToCopy}
							containerClass="w-full h-full"
							dropdownItems={dropdown}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			<Modal modal={selectedPrice?._id == 0 ? '' : '!h-64'} show={showModal} setShow={setShowModal}>
				{!!selectedPrice && (
					<div className="w-full h-full flex flex-col gap-4 p-4">
						<h1 className="text-3xl font-bold text-center">{selectedPrice.wilaya}</h1>
						<div className="flex flex-col gap-4 w-full mx-auto my-auto">
							<div className="flex space-x-2">
								<p className="my-auto">Prix de base: </p>
								<input value={selectedPrice.base} onChange={e => setSelectedPrice(prev => ({ ...prev!, base: parseInt(e.target.value) || 0 }))} type="text" className={`input${10 < 9 ? ' invalid-input' : ''}`} placeholder="Prix de base" />
							</div>
							{selectedPrice._id == 0 ? (
								<>
									<div className="flex space-x-2">
										<p className="my-auto">Prix KM:</p>
										<input value={selectedPrice.kmprice} onChange={e => setSelectedPrice(prev => ({ ...prev!, kmprice: parseInt(e.target.value) || 0 }))} type="text" className={`input${10 < 9 ? ' invalid-input' : ''}`} placeholder="Prix KM" />
									</div>
									<div className="flex space-x-2">
										<p className="my-auto">Prix Minute:</p>
										<input value={selectedPrice.timeprice} onChange={e => setSelectedPrice(prev => ({ ...prev!, timeprice: parseInt(e.target.value) || 0 }))} type="text" className={`input${10 < 9 ? ' invalid-input' : ''}`} placeholder="Prix Minute" />
									</div>
									<div className="flex space-x-2">
										<p className="my-auto">Remise:</p>
										<input value={selectedPrice.discount} onChange={e => setSelectedPrice(prev => ({ ...prev!, discount: parseInt(e.target.value) || 0 }))} type="text" className={`input${10 < 9 ? ' invalid-input' : ''}`} placeholder="Remise" />
									</div>
									<div className="flex space-x-2">
										<p className="my-auto">Prix 2H:</p>
										<input value={selectedPrice.price2h} onChange={e => setSelectedPrice(prev => ({ ...prev!, price2h: parseInt(e.target.value) || 0 }))} type="text" className={`input${10 < 9 ? ' invalid-input' : ''}`} placeholder="Prix 2H" />
									</div>
									<div className="flex space-x-2">
										<p className="my-auto">Prix 4H:</p>
										<input value={selectedPrice.price4h} onChange={e => setSelectedPrice(prev => ({ ...prev!, price4h: parseInt(e.target.value) || 0 }))} type="text" className={`input${10 < 9 ? ' invalid-input' : ''}`} placeholder="Prix 4H" />
									</div>
									<div className="flex space-x-2">
										<p className="my-auto">Prix 8H:</p>
										<input value={selectedPrice.price8h} onChange={e => setSelectedPrice(prev => ({ ...prev!, price8h: parseInt(e.target.value) || 0 }))} type="text" className={`input${10 < 9 ? ' invalid-input' : ''}`} placeholder="Prix 8H" />
									</div>
									<div className="flex space-x-2">
										<p className="my-auto">Augmentation:</p>
										<input value={selectedPrice.increase} onChange={e => setSelectedPrice(prev => ({ ...prev!, increase: parseInt(e.target.value) || 0 }))} type="text" className={`input${10 < 9 ? ' invalid-input' : ''}`} placeholder="Augmentation" />
									</div>
								</>
							) : (
								<>
									<div className="flex space-x-2">
										<p className="my-auto">Remise Wilaya (%): </p>
										<input value={selectedPrice.provinceDiscount} onChange={e => setSelectedPrice(prev => ({ ...prev!, provinceDiscount: parseInt(e.target.value) || 0 }))} type="text" className={`input${10 < 9 ? ' invalid-input' : ''}`} placeholder="Remise Wilaya (%)" />
									</div>
								</>
							)}
						</div>
						<div className="mx-auto py-4">
							<button
								disabled={selectedPrice._id == 0 ? !selectedPrice.base || !selectedPrice.provinceDiscount || selectedPrice.provinceDiscount > 99 : !selectedPrice.base || !selectedPrice.kmprice || !selectedPrice.timeprice || !selectedPrice.discount || !selectedPrice.price2h || !selectedPrice.price4h || !selectedPrice.price8h}
								onClick={validate(selectedPrice)}
								className="bg-teal-500 rounded-full hover:bg-teal-600 main-transition px-8 py-2 disabled:opacity-75 disabled:hover:bg-gray-600 disabled:bg-gray-600"
							>
								Valider
							</button>
						</div>
					</div>
				)}
			</Modal>
		</>
	);
};

export default prices;
