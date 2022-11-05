import Link from 'next/link';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { sidebarElements } from '../utils/sidebar';
import { AuthContext } from '../utils/context';

interface Props {
	logout?: () => void;
}

const Sidebar: React.FC<Props> = (props: Props) => {
	const router = useRouter();

	const { high } = useContext(AuthContext);

	return (
		<aside className="w-48 h-screen">
			<div className="overflow-y-auto h-full py-8 px-3 bg-gray-800">
				<ul className="space-y-2">
					{sidebarElements(high).map((element, index) => (
						<li key={index}>
							<Link href={router.pathname == element.href ? '#' : element.href}>
								<a className={`flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-gray-700 ${router.pathname == element.href ? 'bg-gray-700' : ''}`}>
									<element.icon className="text-gray-500" />
									<span className="ml-3">{element.text}</span>
								</a>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</aside>
	);
};

export default Sidebar;
