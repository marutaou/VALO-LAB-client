const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/AirstrikePost", async (req, res) => {
	const { userId, map, agent, value, standingUrl, landmarkUrl, pins } =
		req.body;

	console.log(req.body);
	try {
		await prisma.airstrikePost.create({
			data: {
				authorId: userId,
				map,
				agent,
				title: value.title,
				comment: value.comment,
				placename: value.placeName,
				posture: value.posture,
				charge: value.charge,
				bounce: value.bounce,
				throwing: value.throwing,
				standingPositionImage: standingUrl,
				landmarkImage: landmarkUrl,
				firingPinX: value.pins[0].x,
				firingPinY: value.pins[0].y,
				fallingPinX: value.pins[1].x,
				fallingPinY: value.pins[1].y,
			},  
		});
		res.status(200).json({ message: "投稿に成功しました。" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "投稿に失敗しました。" });
	}
});

router.get("/AirstrikeListData/:mapName?", async (req, res) => {
	const { mapName } = req.params;
	console.log("Request received with mapName:", mapName); // デバッグ用ログ

	try {
		const latestAirstrikePost = await prisma.airstrikePost.findMany({
			where: { map: mapName },
		});
		console.log("Query result:", latestAirstrikePost); // クエリ結果のログ
		if (latestAirstrikePost) {
			res.json(latestAirstrikePost);
		} else {
			res.json("現在投稿はありません。");
		}
	} catch (error) {
		console.error("Error fetching data:", error); // エラー詳細をログに出力
		res.status(500).json({ message: "データ取得に失敗しました。" });
	}
});

module.exports = router;
