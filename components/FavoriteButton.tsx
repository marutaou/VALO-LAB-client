"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import apiClient from "@/lib/apiClient";
import { useSession } from "next-auth/react";

type FavoriteProps = {
	postId: number;
	favorite: number;
};

export default function FavoriteButton(props: FavoriteProps) {
	const [favorite, setFavorite] = useState(false);
	const [favoriteCount, setFavoriteCount] = useState(0);
	const { data: session } = useSession();

	useEffect(() => {
		console.log("session?.user.id:", session?.user.id);
		console.log("props.postId:", props.postId);

		const getFavoriteStatus = async () => {
			try {
				const response = await apiClient.get<{ isFavorite: boolean }>(
					`/posts/AirstrikeGetFavoriteStatus/${session?.user.id}/${props.postId}`
				);
				console.log(response);
				setFavorite(response.data.isFavorite);
			} catch (error) {
				console.error("Failed to fetch favorite status:", error);
			}
		};
		getFavoriteStatus();

		setFavoriteCount(props.favorite);
		// クリーンアップ関数
		return () => {};
	}, [session?.user.id, props.postId]);

	const handleClick = async () => {
		setFavoriteCount((prev) => (favorite ? prev - 1 : prev + 1));
		setFavorite((prev) => !prev); // 状態を即時反転

		// 状態反転を考慮したエンドポイントを選択
		const isCurrentlyFavorited = favorite; // 現在の状態を保持
		const apiEndpoint = isCurrentlyFavorited
			? "/posts/favorite_dec"
			: "/posts/favorite_inc";

		try {
			// 適切なエンドポイントに API リクエストを送信
			await apiClient.post(apiEndpoint, {
				userId: session?.user.id,
				postId: props.postId,
			});
		} catch (error) {
			console.error("API error:", error);

			// エラー時には状態を元に戻す
			setFavorite(isCurrentlyFavorited);
		}
	};
	return (
		<>
			{session && (
				<button onClick={handleClick}>
					{favorite ? (
						<FontAwesomeIcon
							icon={faStar}
							className="text-lg text-yellow-400 transform hover:scale-125 duration-300"
						/>
					) : (
						<FontAwesomeIcon
							icon={faStar}
							className="text-lg transform hover:scale-125 duration-300"
						/>
					)}
				</button>
			)}
			<p>{favoriteCount}</p>
		</>
	);
}
