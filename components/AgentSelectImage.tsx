import React from "react";
import Image from "next/image";

interface AgentSelectImageProps {
	agentName: string;
}

export default function AgentSelectImage(props: AgentSelectImageProps) {
	return (
		<div className={`w-16 h-16 overflow-hidden rounded-lg `}>
			<Image
				src={`/images/agents/${props.agentName}.png`}
				alt={props.agentName}
				width={500}
				height={500}
				className={`w-16 h-16 rounded-lg transform hover:scale-105 duration-300`}
			/>
		</div>
	);
}
