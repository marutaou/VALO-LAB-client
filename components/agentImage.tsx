import React from "react";
import Image from "next/image";

interface AgentProps {
	agentName: string;
}

const agent = (props: AgentProps) => {
	return (
		<div className="overflow-hidden w-36 h-36 rounded-lg">
			<Image
				src={`/images/agents/${props.agentName}.png`}
				width={150}
				height={150}
				alt={props.agentName}
				className="w-36 h-36 rounded-lg transform hover:scale-125 duration-300"
			/>
		</div>
	);
};

export default agent;
