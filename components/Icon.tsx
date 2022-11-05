import type { NextPage } from 'next';

interface Props {
	image?: string;
	className?: string;
}

const SVGIcon: NextPage<Props> = (props: Props) => {
	return <img src={`/assets/${props.image ?? 'driver-free.png'}`} className={`!w-7 ${!!props.className ? props.className : ''}`} />;
};

export default SVGIcon;
