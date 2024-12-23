import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ContantName {
	contentName: string;
}

const minemenuWindow = (props: ContantName) => {
	return (
		<Link href={`/${props.contentName}`}>
			<div className="w-96 h-60 overflow-hidden rounded-2xl">
				<Image
					src={`/images/contents/${props.contentName}.png`}
					width={500}
					height={300}
					alt={props.contentName}
					className="w-96 h-60 rounded-2xl transform hover:scale-105 duration-300"
				/>
			</div>
		</Link>
	);
};

export default minemenuWindow;
