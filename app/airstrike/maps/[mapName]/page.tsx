"use client";

import React, { useEffect, useState } from "react";
import AgentSelectImage from "@/components/AgentSelectImage";
import { agentArray } from "./post_pin_form/parameter";

import Image from "next/image";
import { Button } from "@/components/ui/button-main";
import Link from "next/link";
import { mapNameConversion } from "@/public/data/mapNameConversion";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import apiClient from "@/lib/apiClient";
import { agentNameConversion } from "@/public/data/agentNameConversion";
import FavoriteButton from "@/components/FavoriteButton";

interface ListData {
	id: number;
	agent: string;
	authorId: string;
	bounce: string;
	charge: string;
	comment: string;
	createdAt: string;
	fallingPinX: number;
	fallingPinY: number;
	firingPinX: number;
	firingPinY: number;
	landmarkImage: string;
	map: string;
	placename: string;
	posture: string;
	standingPositionImage: string;
	throwing: string;
	title: string;
	favorite: number;
}

function Maps({ params }: { params: { mapName: string } }) {
	const [listData, setListData] = useState<ListData[]>([]);
	const [latestListData, setLatestListData] = useState<ListData[]>([]);
	const [selrctTableRow, setSelectTableRow] = useState<number | null>(null);
	const [selectRowArray, setSelectRowArray] = useState<ListData | undefined>(
		undefined
	);
	const [agentImageSelect, setAgentImageSelect] = useState<number | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await apiClient.get(
					`/posts/AirstrikeListData/${params.mapName}`
				);
				setListData(response.data); // データを設定
				setLatestListData(response.data); // データを設定
				console.log(response.data);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			}
		};

		fetchData();
	}, [params.mapName]);

	//クリックしたリストを選択済みにする。
	const handleTableRowClick = (rowId: number) => {
		setSelectTableRow(rowId);
		const selectArray = listData.find((list) => list.id === rowId);
		setSelectRowArray(selectArray);
	};

	const handleAgentImageClick = (agentId: number) => {
		setAgentImageSelect(agentId);
		const agent = agentArray.find((agent) => agent.id === agentId);
		const filterList = listData.filter(
			(data) => data.agent === agent?.AgentName
		);
		setLatestListData(filterList);
	};

	return (
		<div className="container justtify-center mx-auto pt-e flex">
			<main className="w-5/12">
				<h1 className="text-5xl mb-4 border-b-2 w-2/3">
					MAP名:{mapNameConversion(params.mapName)}
				</h1>
				<div className="flex mb-4">
					<h1>発射位置：</h1>
					<div className="w-4 h-4 bg-red-500 rounded-full opacity-80"></div>
					<h1 className="ml-4">着地位置：</h1>
					<div className="w-8 h-8 bg-white rounded-full opacity-60"></div>
				</div>

				<div
					className="relative w-[600px] h-[600px] bg-cover bg-center border-4 border-gray-400 mt-4 mx-auto"
					style={{
						backgroundImage: `url(/images/maps/${params.mapName}-map.png)`,
					}}
				>
					{selectRowArray && (
						<div
							key="standingPoint"
							className="absolute w-4 h-4 bg-red-500 rounded-full opacity-80"
							style={{
								left: `${selectRowArray.firingPinX * 600 - 12}px`,
								top: `${selectRowArray.firingPinY * 600 - 12}px`,
							}}
						/>
					)}
					{selectRowArray && (
						<div
							key="landingPoint"
							className="absolute w-8 h-8 bg-white rounded-full opacity-60"
							style={{
								left: `${selectRowArray.fallingPinX * 600 - 20}px`,
								top: `${selectRowArray.fallingPinY * 600 - 20}px`,
							}}
						/>
					)}
				</div>
			</main>
			<aside className="w-7/12">
				<div className="text-right pt-4 mb-4">
					<Button>
						<Link href={`/airstrike/maps/${params.mapName}/post_pin_form`}>
							<span className="text-lg p-4">空爆ポイントを投稿する</span>
						</Link>
					</Button>
					<div className="flex gap-4 mt-2 ml-10">
						{agentArray.map((agent) => (
							<div
								key={agent.id}
								onClick={() => handleAgentImageClick(agent.id)}
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
								<AgentSelectImage agentName={agent.AgentName} />
							</div>
						))}
					</div>
				</div>
				{agentImageSelect ? (
					latestListData && latestListData.length > 0 ? (
						<div className="ml-10">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>着地点名称</TableHead>
										<TableHead>タイトル</TableHead>
										<TableHead>エージェント名</TableHead>
										<TableHead>投稿者</TableHead>
										<TableHead>詳細</TableHead>
										<TableHead className="text-right">お気に入り</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{latestListData.map((data) => (
										<TableRow
											key={data.id}
											onClick={() => handleTableRowClick(data.id)}
											className={
												selrctTableRow === data.id ? "bg-red-500/50" : ""
											}
										>
											<TableCell className="font-medium">
												{data.placename}
											</TableCell>
											<TableCell>{data.title}</TableCell>
											<TableCell>{agentNameConversion(data.agent)}</TableCell>
											<TableCell>{data.authorId}</TableCell>
											<TableCell>
												<Dialog>
													<DialogTrigger>詳細を見る</DialogTrigger>
													<DialogContent className="flex">
														<DialogHeader className="w-1/2">
															<DialogTitle className="text-4xl font-bold">
																{data.title}
															</DialogTitle>

															<DialogDescription className="text-2xl">
																着地点名称：{data.placename}
															</DialogDescription>
															<DialogDescription className="text-2xl">
																発射時の体勢：{data.posture}
															</DialogDescription>
															{data.charge && (
																<DialogDescription className="text-2xl">
																	チャージ数：{data.charge}
																</DialogDescription>
															)}
															{data.bounce && (
																<DialogDescription className="text-2xl">
																	バウンス数：{data.bounce}
																</DialogDescription>
															)}
															{data.throwing && (
																<DialogDescription className="text-2xl">
																	投げ方；{data.throwing}
																</DialogDescription>
															)}
															<p className="text-2xl">コメント</p>
															<DialogDescription className="text-1xl">
																{data.comment}
															</DialogDescription>
														</DialogHeader>
														<div className="mb-4">
															<div>
																<p className="text-2xl font-bold mb-2">
																	立ち位置画像
																</p>
																<Image
																	src={data.standingPositionImage}
																	width={1920}
																	height={1080}
																	alt={"立ち位置画像"}
																	className="w-[640px] h-[360px] rounded-sm mb-4"
																/>
															</div>
															<div>
																<p className="text-2xl font-bold mb-2">
																	目印画像
																</p>
																<Image
																	src={data.landmarkImage}
																	width={1920}
																	height={1080}
																	alt={"目印画像"}
																	className="w-[640px] h-[360px] rounded-sm"
																/>
															</div>
														</div>
													</DialogContent>
												</Dialog>
											</TableCell>
											<TableCell className="text-right">
												<FavoriteButton />
												{data.favorite}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<div className="ml-10 text-2xl font-bold">投稿がありません。</div>
					)
				) : (
					<div className="ml-10 text-2xl font-bold">
						エージェントを選択してください。
					</div>
				)}
			</aside>
		</div>
	);
}

export default Maps;
