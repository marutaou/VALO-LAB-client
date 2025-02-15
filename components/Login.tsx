"use client";
import { useSession, signIn, signOut } from "next-auth/react";

const Login = () => {
	const { data: session } = useSession();

	if (session) {
		return (
			<div>
				<p>Signed in as {session.user?.email}</p>
				<button onClick={() => signOut()}>Sign out</button>
			</div>
		);
	}
	return (
		<div>
			<p>Not signed in</p>
			<button onClick={() => signIn("google")}>Sign in with Google</button>
		</div>
	);
};

export default Login;
