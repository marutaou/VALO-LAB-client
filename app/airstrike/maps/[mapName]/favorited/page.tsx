"use client";

import React, { useEffect, useState } from "react";
import AgentSelectImage from "@/components/AgentSelectImage";
import { agentArray } from "../post_pin_form/parameter";
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
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import apiClient from "@/lib/apiClient";
import { agentNameConversion } from "@/public/data/agentNameConversion";
import FavoriteButton from "@/components/FavoriteButton";
import { useSession } from "next-auth/react";

interface ListData {
	post: ListProps;
	postId: number;
	usetId: number;
}

interface ListProps {
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
}

function Maps({ params }: { params: { mapName: string } }) {
	const [listData, setListData] = useState<ListData[]>([]);
	const [latestListData, setLatestListData] = useState<ListData[]>([]);
	const [selrctTableRow, setSelectTableRow] = useState<number | null>(null);
	const [selectRowArray, setSelectRowArray] = useState<ListData | undefined>(
		undefined
	);
	const [agentImageSelect, setAgentImageSelect] = useState<number | null>(null);
	const { data: session } = useSession();

	useEffect(() => {
		const fetchData = async () => {
			// console.log(1);
			if (!session?.user?.id) return;
			// console.log(2);

			try {
				// console.log(3);
				const response = await apiClient.get(
					`/posts/favorited_post/${session.user.id}`
				);
				// console.log(response.data);
				setListData(response.data);
				setLatestListData(response.data);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			}
		};

		fetchData();
	}, [session?.user?.id, params.mapName]);
	const handleTableRowClick = (rowId: number) => {
		setSelectTableRow(rowId);
		const selectArray = listData.find((list) => list.post.id === rowId);
		setSelectRowArray(selectArray);
	};

	const handleAgentImageClick = (agentId: number) => {
		setAgentImageSelect(agentId);
		const agent = agentArray.find((agent) => agent.id === agentId);
		const filterList = listData.filter(
			(data) => data.post.agent === agent?.AgentName
		);
		console.log(filterList);
		setLatestListData(filterList);
	};

	return (
		<div className="container mx-auto px-4 py-6">
			<div className="flex flex-col lg:flex-row gap-8">
				{/* Left Column */}
				<main className="w-full lg:w-5/12 space-y-6">
					<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold border-b-2 pb-2 w-full lg:w-2/3">
						MAP名: {mapNameConversion(params.mapName)}
					</h1>

					{/* Map Legend - Visible on all screen sizes */}
					<div className="flex items-center gap-4 mb-4">
						<span>発射位置：</span>
						<div className="w-4 h-4 bg-red-500 rounded-full opacity-80" />
						<span>着地位置：</span>
						<div className="w-8 h-8 bg-white rounded-full opacity-60" />
					</div>

					{/* Map Container - Responsive */}
					<div
						className="relative aspect-square w-full max-w-[600px] mx-auto border-4 border-gray-400 bg-cover bg-center"
						style={{
							backgroundImage: `url(/images/maps/${params.mapName}-map.png)`,
						}}
					>
						{selectRowArray && (
							<>
								<div
									className="absolute w-4 h-4 bg-red-500 rounded-full opacity-80"
									style={{
										left: `${selectRowArray.post.firingPinX * 100}%`,
										top: `${selectRowArray.post.firingPinY * 100}%`,
										transform: "translate(-50%, -50%)",
									}}
								/>
								<div
									className="absolute w-8 h-8 bg-white rounded-full opacity-60"
									style={{
										left: `${selectRowArray.post.fallingPinX * 100}%`,
										top: `${selectRowArray.post.fallingPinY * 100}%`,
										transform: "translate(-50%, -50%)",
									}}
								/>
							</>
						)}
					</div>
				</main>

				{/* Right Column */}
				<aside className="w-full lg:w-7/12">
					{/* Post Button */}
					<div className="flex flex-col gap-4 mb-6">
						<div className="text-right">
							{session ? (
								<>
									<Button>
										<Link href={`/airstrike/maps/${params.mapName}`}>
											<span className="text-base md:text-lg p-2 md:p-4">
												すべて表示
											</span>
										</Link>
									</Button>
									<Button className="ml-4">
										<Link
											href={`/airstrike/maps/${params.mapName}/post_pin_form`}
										>
											<span className="text-base md:text-lg p-2 md:p-4">
												空爆ポイントを投稿する
											</span>
										</Link>
									</Button>
								</>
							) : (
								<AlertDialog>
									<AlertDialogTrigger className="text-base md:text-lg p-2 md:p-4">
										空爆ポイントを投稿する
									</AlertDialogTrigger>
									<AlertDialogContent className="max-w-md mx-4">
										<AlertDialogHeader>
											<AlertDialogTitle>
												ログインしてください。
											</AlertDialogTitle>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>OK</AlertDialogCancel>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
						</div>

						{/* Agent Selection */}
						<div className="flex flex-wrap gap-2 justify-center md:justify-start">
							{agentArray.map((agent) => (
								<div
									key={agent.id}
									onClick={() => handleAgentImageClick(agent.id)}
									className="cursor-pointer transition-all duration-200"
									style={{
										border:
											agentImageSelect === agent.id
												? "2px solid rgb(239 68 68)"
												: "2px solid white",
										opacity:
											agentImageSelect !== null && agentImageSelect !== agent.id
												? 0.4
												: 1,
										borderRadius: 11,
									}}
								>
									<AgentSelectImage agentName={agent.AgentName} />
								</div>
							))}
						</div>
					</div>

					{/* Table Section */}
					<div className="overflow-x-auto">
						{agentImageSelect ? (
							latestListData && latestListData.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="whitespace-nowrap">
												着地点名称
											</TableHead>
											<TableHead className="whitespace-nowrap">
												タイトル
											</TableHead>
											<TableHead className="hidden md:table-cell">
												エージェント名
											</TableHead>
											<TableHead className="hidden md:table-cell">
												投稿者
											</TableHead>
											<TableHead>詳細</TableHead>
											<TableHead className="text-right text-xs md:text-base">
												お気に入り
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{latestListData.map((data) => (
											<TableRow
												key={data.post.id}
												onClick={() => handleTableRowClick(data.post.id)}
												className={
													selrctTableRow === data.post.id ? "bg-red-500/50" : ""
												}
											>
												<TableCell className="font-medium whitespace-nowrap">
													{data.post.placename}
												</TableCell>
												<TableCell className="whitespace-nowrap">
													{data.post.title}
												</TableCell>
												<TableCell className="hidden md:table-cell">
													{agentNameConversion(data.post.agent)}
												</TableCell>
												<TableCell className="hidden md:table-cell">
													{data.post.author.username}
												</TableCell>
												<TableCell>
													<Dialog>
														<DialogTrigger>詳細を見る</DialogTrigger>
														<DialogContent className="max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
															<div className="flex flex-col lg:flex-row gap-6">
																<DialogHeader className="w-full lg:w-1/2">
																	<DialogTitle className="text-2xl md:text-4xl font-bold mb-4">
																		{data.post.title}
																	</DialogTitle>
																	<div className="space-y-4">
																		<DialogDescription className="text-xl md:text-2xl">
																			着地点名称：{data.post.placename}
																		</DialogDescription>
																		<DialogDescription className="text-xl md:text-2xl">
																			発射時の体勢：{data.post.posture}
																		</DialogDescription>
																		{data.post.charge && (
																			<DialogDescription className="text-xl md:text-2xl">
																				チャージ数：{data.post.charge}
																			</DialogDescription>
																		)}
																		{data.post.bounce && (
																			<DialogDescription className="text-xl md:text-2xl">
																				バウンス数：{data.post.bounce}
																			</DialogDescription>
																		)}
																		{data.post.throwing && (
																			<DialogDescription className="text-xl md:text-2xl">
																				投げ方：{data.post.throwing}
																			</DialogDescription>
																		)}
																		<div>
																			<p className="text-xl md:text-2xl font-bold">
																				コメント
																			</p>
																			<DialogDescription className="text-base md:text-lg">
																				{data.post.comment}
																			</DialogDescription>
																		</div>
																		<div>
																			<p className="text-xl md:text-2xl font-bold mb-2">
																				発射位置
																			</p>
																			<div
																				className="relative aspect-square w-full max-w-[450px] bg-cover bg-center border-4 border-gray-400"
																				style={{
																					backgroundImage: `url(/images/maps/${params.mapName}-map.png)`,
																				}}
																			>
																				{selectRowArray && (
																					<>
																						<div
																							className="absolute w-4 h-4 bg-red-500 rounded-full opacity-80"
																							style={{
																								left: `${
																									selectRowArray.post
																										.firingPinX * 100
																								}%`,
																								top: `${
																									selectRowArray.post
																										.firingPinY * 100
																								}%`,
																								transform:
																									"translate(-50%, -50%)",
																							}}
																						/>
																						<div
																							className="absolute w-8 h-8 bg-white rounded-full opacity-60"
																							style={{
																								left: `${
																									selectRowArray.post
																										.fallingPinX * 100
																								}%`,
																								top: `${
																									selectRowArray.post
																										.fallingPinY * 100
																								}%`,
																								transform:
																									"translate(-50%, -50%)",
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
																				src={data.post.standingPositionImage}
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
																				src={data.post.landmarkImage}
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
												<TableCell className="text-right">
													<FavoriteButton
														postId={data.post.id}
														favorite={data.post.favorite}
													/>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<p className="text-xl md:text-2xl font-bold">
									投稿がありません。
								</p>
							)
						) : (
							<p className="text-xl md:text-2xl font-bold">
								エージェントを選択してください。
							</p>
						)}
					</div>
				</aside>
			</div>
		</div>
	);
}

export default Maps;
