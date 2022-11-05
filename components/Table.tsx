import React, { useState } from 'react';
import { formatTextForSearch } from '../utils/format';
import { ArrowDown, ArrowUp, More, PageFirst, PageLast, PageNext, PagePrev } from '../utils/svg';
import Alert from './Alert';

type T = { _id: string } & { [key: string]: { text?: string | JSX.Element; value?: any; class?: string } | string };

interface Props<U> {
	elements: Array<T>;
	sorting: U;
	titles: { name: string; key: string }[];
	searchKeys: string[];
	dropdownItems?: Array<{ name: string; onClick: (id: any) => void; icon?: string; textColor?: string }>;
	button?: { text: string; onClick: () => void; icon?: string };
	centerPage?: number;
	elementsPerPage?: number;
	dropdownReplacement?: { svg: string; onClick: (_id: number) => void };
	className?: string;
	keysNotToCopy?: string[];
	containerClass?: string;
}

const Table = <U extends object>(props: Props<U>) => {
	const centerPage = props.centerPage || 10;
	const elementsPerPage = props.elementsPerPage || 10;

	// @ts-ignore
	const initialElements: Array<T> = props.elements.map(obj => Object.assign(...Object.entries(obj).map(([key, value]) => (key == '_id' ? { [key]: value } : { [key]: { ...value, value: value.value ?? value.text } }))));

	const [elements, setElements] = useState<Array<T>>(initialElements);
	const [sorting, setSorting] = useState<U>(props.sorting);
	const [search, setSearch] = useState('');
	const [pages, setPages] = useState({ number: Math.ceil(elements.length / elementsPerPage), current: 1, elementsPerPage: elementsPerPage });
	const [copyText, setCopyText] = useState('');
	const [showCopy, setShowCopy] = useState(false);

	const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const s = e.target.value;
		const savedElements = s.length
			? initialElements?.filter(e =>
					props.searchKeys
						// @ts-ignore
						.map(key => formatTextForSearch((e[key].searchText || e[key].text)?.toString()).includes(formatTextForSearch(s)))
						.includes(true)
			  ) || []
			: initialElements;
		setPages({ ...pages, number: Math.ceil(savedElements.length / pages.elementsPerPage), current: 1 });
		setElements(savedElements);
		setSearch(s);
	};

	const sort = (event: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
		const key = props.titles.find(e => e.key == event.currentTarget.getAttribute('id'))?.key;
		if (key) {
			setSorting(prev => {
				let s = { ...prev };
				// @ts-ignore
				Object.keys(prev).forEach(k => (s[k] = { clicked: k == key, desc: k == key ? !s[k].desc : false }));
				// @ts-ignore
				setElements(prevProducts => initialElements.filter(e => prevProducts.map(el => el._id).includes(e._id)).sort((a, b) => ((s[key].desc ? a[key].value > b[key].value : a[key].value < b[key].value) ? 1 : -1)));
				return s;
			});
		}
	};

	const setCurrentPage = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const current = parseInt(event.currentTarget?.innerHTML);
		setPages(prev => ({ ...prev, current }));
	};

	const setElementsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const el = parseInt(event.target.value);
		if (event.target.value) setPages(prev => ({ ...prev, elementsPerPage: el, number: Math.ceil((elements || '').length / el), current: 1 }));
	};

	const toggleDropdown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, fromChild = false) => {
		const sibling = fromChild ? (event.currentTarget.parentNode?.parentNode?.parentNode as Element) : event.currentTarget.nextElementSibling;

		if (sibling) {
			sibling.classList.contains('dropdown-visible') ? sibling.classList.remove('dropdown-visible') : sibling.classList.add('dropdown-visible');

			if (fromChild) return;

			const buttonsli = Array.from(sibling.childNodes.item(0)?.childNodes);

			let buttonIndex: number | null = null;

			const eventListener = (e: KeyboardEvent) => {
				switch (e.key) {
					case 'ArrowDown':
						e.preventDefault();
						buttonIndex = ((buttonIndex ?? 1) + 1) % 2;
						(buttonsli[buttonIndex].childNodes[0] as HTMLElement)?.focus();
						break;
					case 'ArrowUp':
						e.preventDefault();
						buttonIndex = ((buttonIndex ?? 0) + 1) % 2;
						(buttonsli[buttonIndex].childNodes[0] as HTMLElement)?.focus();
						break;
					case 'Escape':
						const parent = buttonsli[0].parentNode?.parentElement;
						parent?.classList.remove('dropdown-visible');
						(parent?.previousSibling as HTMLElement)?.focus();
						break;
				}
			};
			document.addEventListener('keydown', eventListener, true);
			const focusoutEventListener = (e: Event) => {
				e.target?.removeEventListener('focusout', focusoutEventListener, false);
				setTimeout(() => {
					if (!(buttonsli[0]?.contains(document.activeElement) || buttonsli[1]?.contains(document.activeElement))) {
						sibling.classList.remove('dropdown-visible');
						document.removeEventListener('keydown', eventListener, true);
					}
				}, 100);
			};
			event.currentTarget.addEventListener('focusout', focusoutEventListener, false);
		}
	};

	const copy = (text: any) => {
		if (text != undefined && String(text).length) {
			navigator.clipboard.writeText(text);
			setCopyText(text);
			setShowCopy(true);
		}
	};

	return (
		<div className={`rounded-xl shadow-md border border-gray-200 ${props.containerClass ? props.containerClass : ''}`}>
			<div className={`table-auto ${props.className ?? ''}`}>
				<div className="p-6 flex space-x-6">
					<div className="flex space-x-2">
						<p className="my-auto">Elements par page: </p>
						<select className="select" onChange={setElementsPerPage} defaultValue={elementsPerPage}>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="25">25</option>
							<option value="50">50</option>
							<option value="100">100</option>
						</select>
					</div>
					<input className="input flex-grow" placeholder="Recherche" value={search} onChange={searchChange} />
				</div>
				<table className="table-auto mx-auto">
					<thead className="border-b border-gray-700">
						<tr>
							{props.titles.map(title => (
								<th key={title.key} className="group cursor-pointer text-sm text-gray-400" id={title.key} onClick={sort}>
									<div className="text-left px-4 flex space-x-2">
										<p>{title.name}</p>
										{/* @ts-ignore */}
										<div className={`round-icon opacity-0 !w-6 !h-6 group-hover:opacity-75 main-transition${sorting[title.key].clicked ? ' !opacity-100' : ''}`}>
											{/* @ts-ignore */}
											{sorting[title.key].desc ? <ArrowUp /> : <ArrowDown />}
										</div>
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{elements?.length ? (
							elements.slice((pages.current - 1) * pages.elementsPerPage, (pages.current - 1) * pages.elementsPerPage + pages.elementsPerPage).map((element, index) => (
								<tr className="hover:bg-gray-800 main-transition" key={element._id}>
									{Object.keys(element).map(
										key =>
											key != '_id' && (
												// @ts-ignore
												<td key={key + index} className={`px-2 py-2 ${element[key].class || ''}`}>
													<div
														className={`break-words px-2 py-1 rounded-xl main-transition ${key == 'id' ? 'text-gray-500 font-bold text-xs' : ''} ${props.keysNotToCopy?.includes(key) ? '' : 'hover:bg-gray-600 cursor-pointer active:bg-gray-700'}`}
														// @ts-ignore
														onClick={() => !props.keysNotToCopy?.includes(key) && copy(element[key]?.textToCopy || element[key]?.text)}
													>
														{/* @ts-ignore */}
														{typeof element[key]?.text == 'string' && element[key]?.text?.includes('\n') ? <pre>{element[key].text ?? '-'}</pre> : element[key].text ?? '-'}
													</div>
												</td>
											)
									)}
									<td>
										<div className="group relative">
											{props.dropdownItems ? (
												<>
													<button className="round-icon hover:bg-gray-600 main-transition" onClick={toggleDropdown}>
														<More />
													</button>
													<nav tabIndex={0} className="z-40 border border-gray-600 bg-gray-500 rounded-2xl invisible opacity-0 w-32 absolute right-0 overflow-hidden outline-none">
														<ul className="py-1">
															{props.dropdownItems.map((item, idx) => (
																<li key={idx}>
																	<button
																		className={`px-4 py-2 w-full cursor-pointer flex justify-start items-center space-x-1 focus:ring-0 focus:bg-gray-700 hover:bg-gray-600 main-transition${item.textColor ? ` ${item.textColor}` : ''}`}
																		onClick={e => {
																			toggleDropdown(e, true);
																			item.onClick(element._id);
																		}}
																	>
																		{/* {item.icon ? (
																		<div className="icon">
																			<ReactSVG src={item.icon} />
																		</div>
																	) : null} */}
																		<span>{item.name}</span>
																	</button>
																</li>
															))}
														</ul>
													</nav>
												</>
											) : props.dropdownReplacement ? (
												<button className="round-icon hover:bg-gray-600 main-transition" onClick={() => props.dropdownReplacement?.onClick(parseInt(element._id))}>
													{/* <ReactSVG src={props.dropdownReplacement.svg} /> */}
												</button>
											) : null}
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td className="text-center py-8" colSpan={6}>
									No items found
								</td>
							</tr>
						)}
					</tbody>
				</table>
				<div className="mx-auto flex justify-center pt-3 border-t space-x-1 border-gray-700 mb-4">
					<div onClick={pages.current == 1 ? () => {} : () => setPages(prev => ({ ...prev, current: 1 }))} className={`round-icon hover:bg-gray-600 main-transition${pages.current == 1 ? ' opacity-30' : ''}`}>
						<PageFirst />
					</div>
					<div onClick={pages.current == 1 ? () => {} : () => setPages(prev => ({ ...prev, current: prev.current - 1 }))} className={`round-icon hover:bg-gray-600 main-transition${pages.current == 1 ? ' opacity-30' : ''}`}>
						<PagePrev />
					</div>
					{[...Array.from(Array(pages.number).keys())]
						.map(e => e + 1)
						.slice(Math.max(pages.current - centerPage - Math.max(pages.current - (pages.number - centerPage) + 1, 0), 0), Math.min(pages.current + centerPage + Math.max(centerPage - pages.current, 0), pages.number) + 1)
						.map(e => (
							<div onClick={setCurrentPage} className={`round-icon hover:bg-gray-600 main-transition${e == pages.current ? ' bg-gray-700' : ''}`} key={e}>
								{e}
							</div>
						))}
					<div onClick={pages.current == pages.number ? () => {} : () => setPages(prev => ({ ...prev, current: prev.current + 1 }))} className={`round-icon hover:bg-gray-600 main-transition${pages.current == pages.number ? ' opacity-30' : ''}`}>
						<PageNext />
					</div>
					<div onClick={pages.current == pages.number ? () => {} : () => setPages(prev => ({ ...prev, current: prev.number }))} className={`round-icon hover:bg-gray-600 main-transition${pages.current == pages.number ? ' opacity-30' : ''}`}>
						<PageLast />
					</div>
				</div>
				<Alert
					show={showCopy}
					setShow={setShowCopy}
					message={
						<span>
							<span className="font-bold">{copyText}</span> copié!
						</span>
					}
					title={false}
				/>
			</div>
		</div>
	);
};

export default Table;
