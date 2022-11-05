import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../utils/api';
import { useRouter } from 'next/router';
import { AuthContext, SocketContext, GlobalContext } from '../utils/context';
import { Socket } from 'socket.io-client';
import { GlobalContextType } from '../utils/types';

function App({ Component, pageProps }: AppProps) {
	const [auth, setAuth] = useState(false);
	const [high, setHigh] = useState(false);
	const [socket, setSocket] = useState<Socket>();
	const [values, setGlobalValues] = useState<GlobalContextType>();

	const router = useRouter();

	useEffect(() => {
		(async () => {
			const { auth, high } = await isAuthenticated();
			setAuth(!!auth);
			setHigh(!!high);

			if (router.pathname == '/login') {
				if (auth) router.push('/');
			} else if (!auth) {
				router.push('login');
			}
		})();
	}, []);

	return (
		<AuthContext.Provider value={{ auth, setAuth, high, setHigh }}>
			<SocketContext.Provider value={{ socket, setSocket }}>
				<GlobalContext.Provider value={{ values, setGlobalValues }}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</GlobalContext.Provider>
			</SocketContext.Provider>
		</AuthContext.Provider>
	);
}

export default App;
