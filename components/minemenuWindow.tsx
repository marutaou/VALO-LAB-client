import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ContantName {
	contentName: string;
}

const minemenuWindow = (props: ContantName) => {
	return (
		<Link href={`/${props.contentName}`}>
			<div className="w-80 h-52 flex items-center justify-center overflow-hidden rounded-2xl">
				<Image
					src={`/images/contents/${props.contentName}.png`}
					width={500}
					height={300}
					alt={props.contentName}
					className="w-80 h-52 rounded-2xl transform hover:scale-105 duration-300"
				/>
			</div>
		</Link>
	);
};

export default minemenuWindow;
