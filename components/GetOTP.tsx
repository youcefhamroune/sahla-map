import type { NextPage } from 'next';
import { FormEvent, useState } from 'react';
import { api } from '../utils/api';

interface Props {
	type: { name: string; value: 'driver' | 'client' };
}

const GetOTP: NextPage<Props> = (props: Props) => {
	const [phone, setPhone] = useState('');
	const [otp, setOtp] = useState<{ phone: string; code: string }[]>([]);

	const getCode = async (type: 'driver' | 'client') => {
		if (phone.length == 0) return;
		const num = parseInt(phone, 10);
		const res = await api.get(`dash/otp?phone=${num}&type=${type}`);
		setOtp(prev => [{ phone: '0' + num, code: res.data.code }, ...prev.slice(0, 4)]);
	};

	return (
		<div key={props.type.value} className="flex flex-col items-center justify-center gap-y-4 w-full h-full">
			<h1 className="text-xl font-bold">{props.type.name}</h1>
			<form
				onSubmit={e => {
					e.preventDefault();
					getCode(props.type.value);
				}}
				className="flex items-center justify-center gap-x-4 mx-auto"
			>
				<input
					className="input"
					type="text"
					placeholder="Numéro"
					value={phone}
					onChange={e => {
						if (e.target.value == '') {
							setPhone(e.target.value);
							return;
						}
						e.target.value.length < (e.target.value[0] == '0' ? 11 : 10) && /^[0-9\b]+$/.test(e.target.value) && setPhone(e.target.value);
					}}
				/>
				<button type="submit" className="bg-teal-500 px-3 py-2 rounded-full hover:bg-teal-600 main-transition">
					Code
				</button>
			</form>
			{!!otp.length && (
				<ul>
					{otp.map((e, i) => (
						<li key={(props.type as unknown as string) + i}>
							{e.phone}
							<span className="mx-3">|</span>
							{e.code}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default GetOTP;
