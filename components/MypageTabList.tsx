"use client";

import React, { useEffect, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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

import { mapsArray, airstrikeAgentArray } from "../public/data/paramater";
import apiClient from "@/lib/apiClient";
import { useSession } from "next-auth/react";
import { agentNameConversion } from "@/public/data/agentNameConversion";
import { mapNameConversion } from "@/public/data/mapNameConversion";
import Image from "next/image";

type ContentProps = {
	contentsName: string;
};

type AgentArrayType = {
	id: number;
	agentName: string;
	agentValue: string;
};

type ListData = {
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
	author: {
		userId: number;
		username: string;
		userEmail: string;
	};
};

// contentsName に対応する配列をマッピング
const agentArrayMap: Record<string, AgentArrayType[]> = {
	airstrike: airstrikeAgentArray,
	// 今後追加する場合はここに追加
};

function MypageTabList(props: ContentProps) {
	// props.contentsName に対応するエージェント配列を取得
	const dynamicArray: AgentArrayType[] =
		agentArrayMap[props.contentsName] || [];
	const [myListData, setMyListData] = useState<ListData[]>([]);
	const [filteredData, setFilteredData] = useState<ListData[]>([]);
	const [selectedMap, setSelectedMap] = useState<string>("");
	const [selectedAgent, setSelectedAgent] = useState<string>("");
	const { data: session } = useSession();

	useEffect(() => {
		const fetchMyListData = async () => {
			const response = await apiClient.get(
				`/posts/myposts/${props.contentsName}/${session?.user.id}`
			);
			// console.log(response.data);
			setMyListData(response.data);
			setFilteredData(response.data);
		};
		fetchMyListData();
	}, [session?.user?.id, props.contentsName]);

	useEffect(() => {
		let filtered = myListData;

		if (selectedMap) {
			filtered = filtered.filter(
				(data) => mapNameConversion(data.map) === selectedMap
			);
		}
		if (selectedAgent) {
			filtered = filtered.filter(
				(data) => agentNameConversion(data.agent) === selectedAgent
			);
		}

		setFilteredData(filtered);
	}, [selectedMap, selectedAgent, myListData]);

	return (
		<div>
			<div className="flex m-4 gap-4">
				<Select onValueChange={(value) => setSelectedMap(value)}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="マップ名" />
					</SelectTrigger>
					<SelectContent>
						{mapsArray.map((map) => (
							<SelectItem key={map.id} value={map.mapName}>
								{map.mapName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select onValueChange={(value) => setSelectedAgent(value)}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="エージェント名" />
					</SelectTrigger>
					<SelectContent>
						{dynamicArray.length > 0 ? (
							dynamicArray.map((agent) => (
								<SelectItem key={agent.id} value={agent.agentName}>
									{agent.agentName}
								</SelectItem>
							))
						) : (
							<SelectItem disabled value="">
								データがありません
							</SelectItem>
						)}
					</SelectContent>
				</Select>
			</div>
			<div className="flex flex-wrap gap-2 justify-center md:justify-start">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="hidden md:table-cell">マップ名</TableHead>
							<TableHead className="whitespace-nowrap">着地点名称</TableHead>
							<TableHead className="whitespace-nowrap">タイトル</TableHead>
							<TableHead className="hidden md:table-cell">
								エージェント名
							</TableHead>
							<TableHead>詳細</TableHead>
							<TableHead className="text-right text-xs md:text-base">
								お気に入り
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredData ? (
							filteredData.map((data) => (
								<TableRow>
									<TableCell className="font-medium">
										{mapNameConversion(data.map)}
									</TableCell>
									<TableCell>{data.placename}</TableCell>
									<TableCell>{data.title}</TableCell>
									<TableCell className="text-right">
										{agentNameConversion(data.agent)}
									</TableCell>
									<TableCell className="text-right">
										<Dialog>
											<DialogTrigger>詳細を見る</DialogTrigger>
											<DialogContent className="max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
												<div className="flex flex-col lg:flex-row gap-6">
													<DialogHeader className="w-full lg:w-1/2">
														<DialogTitle className="text-2xl md:text-4xl font-bold mb-4">
															{data.title}
														</DialogTitle>
														<div className="space-y-4">
															<DialogDescription className="text-xl md:text-2xl">
																着地点名称：{data.placename}
															</DialogDescription>
															<DialogDescription className="text-xl md:text-2xl">
																発射時の体勢：{data.posture}
															</DialogDescription>
															{data.charge && (
																<DialogDescription className="text-xl md:text-2xl">
																	チャージ数：{data.charge}
																</DialogDescription>
															)}
															{data.bounce && (
																<DialogDescription className="text-xl md:text-2xl">
																	バウンス数：{data.bounce}
																</DialogDescription>
															)}
															{data.throwing && (
																<DialogDescription className="text-xl md:text-2xl">
																	投げ方：{data.throwing}
																</DialogDescription>
															)}
															<div>
																<p className="text-xl md:text-2xl font-bold">
																	コメント
																</p>
																<DialogDescription className="text-base md:text-lg">
																	{data.comment}
																</DialogDescription>
															</div>
															<div>
																<p className="text-xl md:text-2xl font-bold mb-2">
																	発射位置
																</p>
																<div
																	className="relative aspect-square w-full max-w-[450px] bg-cover bg-center border-4 border-gray-400"
																	style={{
																		backgroundImage: `url(/images/maps/${data.map}-map.png)`,
																	}}
																>
																	{data && (
																		<>
																			<div
																				className="absolute w-4 h-4 bg-red-500 rounded-full opacity-80"
																				style={{
																					left: `${data.firingPinX * 100}%`,
																					top: `${data.firingPinY * 100}%`,
																					transform: "translate(-50%, -50%)",
																				}}
																			/>
																			<div
																				className="absolute w-8 h-8 bg-white rounded-full opacity-60"
																				style={{
																					left: `${data.fallingPinX * 100}%`,
																					top: `${data.fallingPinY * 100}%`,
																					transform: "translate(-50%, -50%)",
																				}}
																			/>
																		</>
																	)}
																</div>
															</div>
														</div>
													</DialogHeader>
													<div className="w-full lg:w-1/2 space-y-6">
														<div>
															<p className="text-xl md:text-2xl font-bold mb-2">
																立ち位置画像
															</p>
															<div className="relative aspect-video w-full">
																<Image
																	src={data.standingPositionImage}
																	fill
																	alt="立ち位置画像"
																	className="rounded-sm object-cover"
																/>
															</div>
														</div>
														<div>
															<p className="text-xl md:text-2xl font-bold mb-2">
																目印画像
															</p>
															<div className="relative aspect-video w-full">
																<Image
																	src={data.landmarkImage}
																	fill
																	alt="目印画像"
																	className="rounded-sm object-cover"
																/>
															</div>
														</div>
													</div>
												</div>
											</DialogContent>
										</Dialog>
									</TableCell>
									<TableCell className="text-right">{data.favorite}</TableCell>
								</TableRow>
							))
						) : (
							<></>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

export default MypageTabList;
