export const mapNameConversion = (mapNameEG: string) => {
	const mapName = {
		ascent: "アセント",
		split: "スプリット",
		haven: "ヘイブン",
		bind: "バインド",
		icebox: "アイスボックス",
		breeze: "ブリーズ",
		fracture: "フラクチャー",
		pearl: "パール",
		lotus: "ロータス",
		sunset: "サンセット",
		abyss: "アビス",
	};

	return mapName[mapNameEG as keyof typeof mapName] || mapNameEG;
};
