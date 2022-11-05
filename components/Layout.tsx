import type { NextPage } from 'next';
import Sidebar from './Sidebar';
import { useContext } from 'react';
import { AuthContext } from '../utils/context';

interface Props {
	children: JSX.Element;
}

const Layout: NextPage<Props> = (props: Props) => {
	const { auth } = useContext(AuthContext);

	return (
		<div className="flex gap-x-2 w-screen h-screen">
			{auth && <Sidebar />}
			<main className="overflow-x-auto overflow-y-auto flex-1">{props.children}</main>
		</div>
	);
};

export default Layout;
