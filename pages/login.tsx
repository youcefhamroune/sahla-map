import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { api } from '../utils/api';
import { AuthContext } from '../utils/context';
import { TOKEN_NAME } from '../utils/values';

interface Props {}

const login: NextPage<Props> = (props: Props) => {
	const [showPassword, setShowPassword] = useState(false);
	const [password, setPassword] = useState('');
	const [buttonDisabled, setButtonDisabled] = useState(false);

	const router = useRouter();

	const { setAuth, setHigh } = useContext(AuthContext);

	const login = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setButtonDisabled(true);

		try {
			const res = await api.get('dash/login', { headers: { Authorization: password } });

			if (!!res.data.token) {
				setAuth(true);
				setHigh(!!res.data.high);
				router.push('/');
				localStorage.setItem(TOKEN_NAME, res.data.token);
			}
		} catch (error) {
			//
		}

		setButtonDisabled(false);
	};

	return (
		<>
			<Head>
				<title>Login</title>
			</Head>

			<form className="p-4 max-w-md mx-auto bg-gray-800 mt-32 rounded-lg" onSubmit={login}>
				<h1 className="font-medium text-3xl text-center py-4 text-white">Connexion</h1>
				<label className="font-medium block mb-1 text-gray-300" htmlFor="password">
					Mot de passe
				</label>
				<div className="relative w-full">
					<div className="absolute inset-y-0 right-0 flex items-center px-2">
						<input className="hidden js-password-toggle" />
						<label onClick={() => setShowPassword(prev => !prev)} className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label" htmlFor="toggle">
							afficher
						</label>
					</div>
					<input onChange={e => setPassword(e.target.value)} className="main-transition appearance-none border-2 rounded w-full py-3 px-3 leading-tight border-gray-300 bg-gray-100 focus:outline-none focus:border-red-500 focus:bg-white text-gray-700 pr-16 font-mono js-password" id="password" type={showPassword ? 'text' : 'password'} autoComplete="off" />
				</div>

				<button className="main-transition w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 mt-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-25" type="submit" disabled={buttonDisabled}>
					Connexion
				</button>
			</form>
		</>
	);
};

export default login;
