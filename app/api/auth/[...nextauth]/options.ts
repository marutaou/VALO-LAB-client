import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import apiClient from "@/lib/apiClient";

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async signIn({ user, account }) {
			try {
				if (account?.provider === "google") {
					// デバッグ用にログを追加
					// console.log("User:", user);
					// console.log("Account:", account);

					const response = await apiClient.post("/auth/findUser", {
						username: user.name,
						email: user.email,
					});
					const userId = response.data.userId;
					//userにIDを追加
					user.id = userId;

					const username = response.data.username;
					console.log(username);
					user.username = username;

					return true;
				}
				return false;
			} catch (error) {
				console.error("Sign in error:", error);
				return false;
			}
		},
		// JWTコールバックを追加
		async jwt({ token, user }) {
			if (user) {
				token.userId = user.id;
				token.name = user.username;
			}
			return token;
		},
		// セッションコールバックを追加
		async session({ session, token }) {
			try {
				// APIを使用して最新のユーザー情報を取得
				const response = await apiClient.post("/auth/findUser", {
					email: session.user.email,
				});

				// セッションに最新の情報を追加
				return {
					...session,
					user: {
						...session.user,
						id: token.userId,
						username: response.data.username, // 最新のユーザー名
						// 他に必要なユーザー情報があればここに追加
					},
				};
			} catch (error) {
				console.error("Session callback error:", error);
				// エラーが発生しても基本的なセッション情報は返す
				return {
					...session,
					user: {
						...session.user,
						id: token.userId,
					},
				};
			}
		},
	},
	debug: true, // デバッグモードを有効化
};
