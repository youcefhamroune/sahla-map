import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../utils/context';
import { TOKEN_NAME } from '../utils/values';

interface Props {}

const logout: NextPage<Props> = (props: Props) => {
	const { setAuth, setHigh } = useContext(AuthContext);
	const router = useRouter();

	useEffect(() => {
		localStorage.removeItem(TOKEN_NAME);
		setAuth(false);
		setHigh(false);
		router.push('/login');
	});
	return <></>;
};

export default logout;
