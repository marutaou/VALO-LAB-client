import React from "react";
import Image from "next/image";

interface AgentSelectImageProps {
	agentName: string;
	imageWidth: number;
	imageHeight: number;
}

export default function AgentSelectImage(props: AgentSelectImageProps) {
	return (
		<div
			className={`w-[${props.imageWidth}px] h-[${props.imageHeight}px] overflow-hidden rounded-2xl`}
		>
			<Image
				src={`/images/agents/${props.agentName}.png`}
				alt={props.agentName}
				width={props.imageWidth}
				height={props.imageHeight}
				className={`w-[${props.imageWidth}px] h-[${props.imageHeight}px] rounded-2xl transform hover:scale-105 duration-300`}
			/>
		</div>
	);
}
