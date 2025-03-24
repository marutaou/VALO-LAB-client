export const agentNameConversion = (agentNameEG: string) => {
	const agentName = {
		jett: "ジェット",
		phoenix: "フェニックス",
		neon: "ネオン",
		yoru: "ヨル",
		raze: "レイズ",
		reyna: "レイナ",
		iso: "アイソ",
		sova: "ソーヴァ",
		kayo: "KAY/O",
		skye: "スカイ",
		fade: "フェイド",
		breach: "ブリーチ",
		gekko: "ゲッコー",
		sage: "セージ",
		killjoy: "キルジョイ",
		cypher: "サイファー",
		chamber: "チェンバー",
		deadlock: "デッドロック",
		vyse: "ヴァイス",
		brimstone: "ブリムストーン",
		astra: "アストラ",
		viper: "ヴァイパー",
		omen: "オーメン",
		harbor: "ハーバー",
		clove: "クローヴ",
    tejo:"テホ",
	};

	return agentName[agentNameEG as keyof typeof agentName] || agentNameEG;
};
