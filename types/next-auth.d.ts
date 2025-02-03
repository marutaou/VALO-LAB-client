import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id?: string | number;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}

	interface User extends DefaultUser {
		id?: string;
		username?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
		accessToken?: string;
	}
}
