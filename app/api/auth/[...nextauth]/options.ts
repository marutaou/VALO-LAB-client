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
					console.log(userId);
					//userにIDを追加
					user.id = userId;

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
			}
			return token;
		},
		// セッションコールバックを追加
		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					id: token.userId,
				},
			};
		},
	},
	debug: true, // デバッグモードを有効化
};