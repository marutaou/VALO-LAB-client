import React from "react";
import MapmenuWindow from "../../components/mapmenuWindow";

function Airstrike() {
	const mapsArray = [
		{ id: 1, mapName: "ascent" },
		{ id: 2, mapName: "split" },
		{ id: 3, mapName: "haven" },
		{ id: 4, mapName: "bind" },
		{ id: 5, mapName: "icebox" },
		{ id: 6, mapName: "breeze" },
		{ id: 7, mapName: "fracture" },
		{ id: 8, mapName: "pearl" },
		{ id: 9, mapName: "lotus" },
		{ id: 10, mapName: "sunset" },
		{ id: 11, mapName: "abyss" },
	];
	return (
		<div className="container justtify-center mx-auto pt-10">
			<h1 className="text-2xl font-bold">MAPを選択してください。</h1>
			<div className="grid grid-cols-4 gap-1">
				{mapsArray.map((map) => (
					<MapmenuWindow
						key={map.id}
						contentName={map.mapName}
						category={"airstrike"}
					/>
				))}
			</div>
		</div>
	);
}

export default Airstrike;
