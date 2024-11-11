"use client";

import React, { useEffect, useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebaseConfig";
import apiClient from "@/lib/apiClient";
import Image from "next/image";

import { mapNameConversion } from "@/public/data/mapNameConversion";
import AgentImage from "@/components/agentImage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button-main";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { agentArray, postureArray } from "./parameter";

interface Place {
	id: number;
	placeName: string;
}

interface MapData {
	maps: {
		[key: string]: Place[];
	};
}

function PostPinForm({ params }: { params: { mapName: string } }) {
	const [agentImageSelect, setAgentImageSelect] = useState<number | null>(null);
	const [placeNames, setPlaceNames] = useState<
		{ id: number; placeName: string }[]
	>([]);
	const [image1Preview, setImage1Preview] = useState<string | null>(null);
	const [image2Preview, setImage2Preview] = useState<string | null>(null);
	const [pins, setPins] = useState<{ x: number; y: number }[]>([]);
	const router = useRouter();

	const formSchema = z.object({
		title: z
			.string()
			.min(1, "タイトルは必須です")
			.max(30, "タイトルは30文字以内にしてください"),
		comment: z
			.string()
			.min(1, "コメントは必須です")
			.max(250, "コメントは250文字以内にしてください"),
		placeName: z.string().min(1, "マップ名称は必須です"),
		posture: z.string().min(1, "体勢は必須です"),
		pins: z
			.array(z.object({ x: z.number(), y: z.number() }))
			.length(2, "発射位置と着地位置を指定してください"),
		charge:
			agentImageSelect === 3
				? z.string().min(1, "チャージ数は必須です")
				: z.string().optional(),
		bounce:
			agentImageSelect === 3
				? z.string().min(1, "バウンス数は必須です")
				: z.string().optional(),
		throwing:
			agentImageSelect === 6 ||
			agentImageSelect === 7 ||
			agentImageSelect === 8 ||
			agentImageSelect === 10
				? z.string().min(1, "投げ方は必須です")
				: z.string().optional(),
		standingPositionImage: z
			.custom<FileList>(
				(fileList) => fileList && fileList.length > 0,
				"立ち位置画像は必須です"
			) // ファイルの存在チェック
			.refine(
				(fileList) => fileList[0]?.size <= 5 * 1024 * 1024, // 5MB以下のサイズ制限
				"画像は5MB以下にしてください"
			)
			.refine(
				(fileList) =>
					["image/jpeg", "image/png", "image/gif", "image/jpg"].includes(
						fileList[0]?.type
					),
				"画像形式はjpeg, jpg, png, gifにしてください"
			),
		landmarkImage: z
			.custom<FileList>(
				(fileList) => fileList && fileList.length > 0,
				"目印画像は必須です"
			) // ファイルの存在チェック
			.refine(
				(fileList) => fileList[0]?.size <= 5 * 1024 * 1024, // 5MB以下のサイズ制限
				"画像は5MB以下にしてください"
			)
			.refine(
				(fileList) =>
					["image/jpeg", "image/png", "image/gif"].includes(fileList[0]?.type),
				"画像形式はjpeg, jpg, png, gifにしてください"
			),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			comment: "",
			placeName: "",
			posture: "",
			charge: "",
			bounce: "",
			throwing: "",
			pins: [],
		},
	});

	const {
		setValue,
		reset,
		formState: { errors },
	} = form;

	useEffect(() => {
		reset({
			title: "",
			comment: "",
			placeName: "",
			posture: "",
			charge: "",
			bounce: "",
			throwing: "",
			pins: [],
		});
	}, [agentImageSelect, reset]);

	const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = (e.clientX - rect.left) / 700;
		const y = (e.clientY - rect.top) / 700;

		setPins((prevPins) =>
			prevPins.length < 2 ? [...prevPins, { x, y }] : prevPins
		); // 2本までのピンに制限

		// フォームにピンデータを設定
		setValue("pins", [...pins, { x, y }]);
	};

	// ピンのリセット
	const handlePinReset = () => {
		setPins([]);
		setValue("pins", []);
		// reset({
		// 	pins: [],
		// });
	};

	const onSubmit = async (value: z.infer<typeof formSchema>) => {
		try {
			//画像データをFireBaseに保存する
			const standingRef = ref(
				storage,
				`uploads/${value.standingPositionImage[0].name}`
			);
			const landmarkRef = ref(
				storage,
				`uploads/${value.landmarkImage[0].name}`
			);

			const [standingUrl, landmarkUrl] = await Promise.all([
				getDownloadURL(standingRef),
				getDownloadURL(landmarkRef),
			]);

			//APIをたたいてsupabaseにformデータを保存
			const agent = agentArray.find((agent) => agent.id === agentImageSelect);

			await apiClient.post("/posts/AirstrikePost", {
				value,
				standingUrl,
				landmarkUrl,
				agent: agent?.AgentName,
				userId: "marutaou",
				map: params.mapName,
			});

			reset();
			router.push(`/airstrike/maps/${params.mapName}`);
		} catch (error) {
			console.error("エラー:", error);
			alert("エラーが発生しました");
		}
	};

	const onError = (errors: FieldErrors) => {
		if (errors) {
			window.alert("入力内容に不備があります。"); // アラートを表示
		}
	};

	// JSONファイルからマップデータを取得する
	useEffect(() => {
		const fetchPlaceNames = async () => {
			try {
				const res = await fetch("/data/mapsPlaceName.json");
				const data: MapData = await res.json();
				const selectedMap = data.maps[params.mapName.toLowerCase()]; // マップ名に対応するデータを取得
				if (selectedMap) {
					setPlaceNames(selectedMap);
				} else {
					console.error("マップデータが見つかりません");
				}
			} catch (error) {
				console.error("マップデータの読み込みに失敗しました", error);
			}
		};

		fetchPlaceNames();
	}, [params.mapName]);

	return (
		<div className="container mx-auto pt-10">
			<div className="mb-4 text-2xl border-b-2 w-48">
				マップ名:{mapNameConversion(params.mapName)}
			</div>
			<div className="flex justify-between mb-4">
				{agentArray.map((agent) => (
					<div
						key={agent.id}
						onClick={() => setAgentImageSelect(agent.id)}
						style={{
							border:
								agentImageSelect === agent.id
									? "2px solid rgb(239 68 68)"
									: "2px solid white", // IDが一致する場合はボーダーを表示
							opacity:
								agentImageSelect !== null && agentImageSelect !== agent.id
									? 0.4
									: 1, // 一致しない場合は画像を暗く
							borderRadius: 11,
						}}
					>
						<AgentImage agentName={agent.AgentName} />
					</div>
				))}
			</div>
			{agentImageSelect ? (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit, onError)}>
						<div className="w-1/2 mx-auto">
							<div className="w-full">
								<div className="mb-4">
									<Card className="px-4">
										<CardHeader>
											<CardTitle>タイトル</CardTitle>
											{errors.title ? (
												<p className="text-red-600">{errors.title.message}</p>
											) : (
												<CardDescription>
													タイトルを入力してください
												</CardDescription>
											)}
										</CardHeader>
										<CardContent>
											<FormField
												control={form.control}
												name="title"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input id="title" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>
										</CardContent>
										<CardHeader>
											<CardTitle>コメント</CardTitle>
											{errors.comment ? (
												<p className="text-red-600">{errors.comment.message}</p>
											) : (
												<CardDescription>
													コメントを入力してください
												</CardDescription>
											)}
										</CardHeader>
										<CardContent>
											<FormField
												control={form.control}
												name="comment"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Textarea id="comment" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>
										</CardContent>
										<CardHeader>
											<CardTitle>着地点名称</CardTitle>
											{errors.placeName ? (
												<p className="text-red-600">
													{errors.placeName.message}
												</p>
											) : (
												<CardDescription>
													マップの名称を選択してください
												</CardDescription>
											)}
										</CardHeader>
										<CardContent>
											<FormField
												control={form.control}
												name="placeName"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Select
																value={field.value}
																onValueChange={field.onChange}
															>
																<SelectTrigger className="w-[180px]">
																	<SelectValue placeholder="着地点" />
																</SelectTrigger>
																<SelectContent>
																	{placeNames.map((place) => (
																		<SelectItem
																			key={place.id}
																			value={place.placeName}
																		>
																			{place.placeName}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														</FormControl>
													</FormItem>
												)}
											/>
										</CardContent>
										<CardHeader>
											<CardTitle>発射時の体勢</CardTitle>
											{errors.posture ? (
												<p className="text-red-600">{errors.posture.message}</p>
											) : (
												<CardDescription>
													体勢を選択してください
												</CardDescription>
											)}
										</CardHeader>
										<CardContent>
											<FormField
												control={form.control}
												name="posture"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Select
																value={field.value}
																onValueChange={field.onChange}
															>
																<SelectTrigger className="w-[180px]">
																	<SelectValue placeholder="体勢" />
																</SelectTrigger>
																<SelectContent>
																	{postureArray.map((posture) => (
																		<SelectItem
																			key={posture.id}
																			value={posture.postureValue}
																		>
																			{posture.posture}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														</FormControl>
													</FormItem>
												)}
											/>
										</CardContent>
										{agentImageSelect === 3 ? ( //ソーヴァが選ばれているときはショックボルト用のUIを追加する
											<div>
												<CardHeader>
													<CardTitle>ショックボルトの設定</CardTitle>
												</CardHeader>
												<CardContent>
													{errors.charge ? (
														<p className="text-red-600">
															{errors.charge.message}
														</p>
													) : (
														<CardDescription>
															チャージ数を選択してください
														</CardDescription>
													)}

													<FormField
														control={form.control}
														name="charge"
														render={({ field }) => (
															<FormItem>
																<FormControl>
																	<Select
																		value={field.value}
																		onValueChange={field.onChange}
																	>
																		<SelectTrigger className="w-[180px]">
																			<SelectValue placeholder="チャージ数" />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem key="0" value="0">
																				0
																			</SelectItem>
																			<SelectItem key="1" value="1">
																				1
																			</SelectItem>
																			<SelectItem key="2" value="2">
																				2
																			</SelectItem>
																			<SelectItem key="3" value="3">
																				3
																			</SelectItem>
																		</SelectContent>
																	</Select>
																</FormControl>
															</FormItem>
														)}
													/>
													{errors.bounce ? (
														<p className="text-red-600">
															{errors.bounce.message}
														</p>
													) : (
														<CardDescription>
															バウンス数を選択してください
														</CardDescription>
													)}

													<FormField
														control={form.control}
														name="bounce"
														render={({ field }) => (
															<FormItem>
																<FormControl>
																	<Select
																		value={field.value}
																		onValueChange={field.onChange}
																	>
																		<SelectTrigger className="w-[180px]">
																			<SelectValue placeholder="バウンス数" />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem key="0" value="0">
																				0
																			</SelectItem>
																			<SelectItem key="1" value="1">
																				1
																			</SelectItem>
																			<SelectItem key="2" value="2">
																				2
																			</SelectItem>
																		</SelectContent>
																	</Select>
																</FormControl>
															</FormItem>
														)}
													/>
												</CardContent>
											</div>
										) : (
											<></>
										)}
										{agentImageSelect === 6 ||
										agentImageSelect === 7 ||
										agentImageSelect === 8 ||
										agentImageSelect === 10 ? (
											<div>
												<CardHeader>
													<CardTitle>投げ方</CardTitle>
													{errors.throwing ? (
														<p className="text-red-600">
															{errors.throwing.message}
														</p>
													) : (
														<CardDescription>
															投げ方を選択してください
														</CardDescription>
													)}
												</CardHeader>
												<CardContent>
													<FormField
														control={form.control}
														name="throwing"
														render={({ field }) => (
															<FormItem>
																<FormControl>
																	<Select
																		value={field.value}
																		onValueChange={field.onChange}
																	>
																		<SelectTrigger className="w-[180px]">
																			<SelectValue placeholder="投げ方" />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem key="0" value="右投げ">
																				右投げ
																			</SelectItem>
																			<SelectItem key="1" value="左投げ">
																				左投げ
																			</SelectItem>
																		</SelectContent>
																	</Select>
																</FormControl>
															</FormItem>
														)}
													/>
												</CardContent>
											</div>
										) : (
											<div></div>
										)}
									</Card>
								</div>
							</div>

							<div className="w-full mb-4">
								<Card className="px-4">
									<CardHeader>
										<CardTitle>立ち位置画像</CardTitle>
										{errors.standingPositionImage ? (
											<p className="text-red-600">
												{errors.standingPositionImage.message}
											</p>
										) : (
											<CardDescription>
												立つ場所がわかるような画像を選択してください
											</CardDescription>
										)}
									</CardHeader>
									<CardContent>
										<FormField
											control={form.control}
											name="standingPositionImage"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															id="standingPositionImage"
															type="file"
															accept=".png, .jpeg, .jpg"
															onChange={(e) => {
																const file =
																	e.target.files && e.target.files[0];
																if (file) {
																	field.onChange(e.target.files); // React Hook Form にファイルを渡す
																	const reader = new FileReader();
																	reader.onloadend = () => {
																		if (typeof reader.result === "string") {
																			setImage1Preview(reader.result); // string の場合のみプレビューにセット
																		}
																	};
																	reader.readAsDataURL(file); // 画像ファイルをDataURLに変換
																}
															}}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										{image1Preview && (
											<Image
												src={image1Preview}
												alt="Previe"
												width={500}
												height={300}
												className="mt-2 w-full"
											/>
										)}
									</CardContent>
								</Card>
							</div>

							<div className="mb-4 w-full">
								<Card className="px-4">
									<CardHeader>
										<CardTitle>目印画像</CardTitle>
										{errors.landmarkImage ? (
											<p className="text-red-600">
												{errors.landmarkImage.message}
											</p>
										) : (
											<CardDescription>
												目印となるポイントがわかるような画像を選択してください
											</CardDescription>
										)}
									</CardHeader>
									<CardContent>
										<FormField
											control={form.control}
											name="landmarkImage"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															id="landmarkImage"
															type="file"
															accept=".png, .jpeg, .jpg"
															onChange={(e) => {
																const file =
																	e.target.files && e.target.files[0];
																if (file) {
																	field.onChange(e.target.files); // React Hook Form にファイルを渡す
																	const reader = new FileReader();
																	reader.onloadend = () => {
																		if (typeof reader.result === "string") {
																			setImage2Preview(reader.result); // string の場合のみプレビューにセット
																		}
																	};
																	reader.readAsDataURL(file); // 画像ファイルをDataURLに変換
																}
															}}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										{image2Preview && (
											<Image
												src={image2Preview}
												alt="Preview"
												width={500}
												height={300}
												className="mt-2 w-full"
											/>
										)}
									</CardContent>
								</Card>
							</div>
							<Card className="px-4">
								<CardHeader>
									<CardTitle>発射位置と着地位置</CardTitle>
									{errors.pins ? (
										<p className="text-red-600">{errors.pins.message}</p>
									) : (
										<CardDescription>
											発射位置と着地位置にピンを刺してください。
										</CardDescription>
									)}
									<div className="flex">
										<h1>発射位置：</h1>
										<div className="w-4 h-4 bg-red-500 rounded-full opacity-80"></div>
									</div>
									<div className="flex">
										<h1>着地位置：</h1>
										<div className="w-8 h-8 bg-white rounded-full opacity-60"></div>
									</div>
								</CardHeader>
								<CardContent>
									<div
										className="relative w-[700px] h-[700px] bg-cover bg-center border-4 border-gray-400 mt-4 mx-auto"
										style={{
											backgroundImage: `url(/images/maps/${params.mapName}-map.png)`,
										}}
										onClick={handleMapClick}
									>
										{pins[0] && (
											<div
												key="standingPoint"
												className="absolute w-4 h-4 bg-red-500 rounded-full opacity-80"
												style={{
													left: `${pins[0].x * 700 - 12}px`,
													top: `${pins[0].y * 700 - 12}px`,
												}}
											/>
										)}
										{pins[1] && (
											<div
												key="landingPoint"
												className="absolute w-8 h-8 bg-white rounded-full opacity-60"
												style={{
													left: `${pins[1].x * 700 - 20}px`,
													top: `${pins[1].y * 700 - 20}px`,
												}}
											/>
										)}
									</div>
								</CardContent>
								<div className="w-[700px] mx-auto text-right my-4">
									<Button className="w-28" onClick={handlePinReset}>
										リセット
									</Button>
								</div>
							</Card>

							<div className="text-right my-8">
								<Button className="px-10 " type="submit">
									投稿
								</Button>
							</div>
						</div>
					</form>
				</Form>
			) : (
				<p className="text-2xl">エージェントを選択してください。</p>
			)}
		</div>
	);
}

export default PostPinForm;
