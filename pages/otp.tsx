import type { NextPage } from 'next';
import Head from 'next/head';
import { FormEvent, useState } from 'react';
import GetOTP from '../components/GetOTP';
import { api } from '../utils/api';

interface Props {}

const otp: NextPage<Props> = (props: Props) => {
	return (
		<>
			<Head>
				<title>OTP</title>
			</Head>

			<div className="flex w-full h-full gap-x-16 justify-center items-center">
				{[
					{ name: 'Chauffeur', value: 'driver' as 'driver' | 'client' },
					{ name: 'Client', value: 'client' as 'driver' | 'client' },
				].map(type => (
					<GetOTP key={type.value} type={type} />
				))}
			</div>
		</>
	);
};

export default otp;
