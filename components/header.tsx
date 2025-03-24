"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button-header";
import { Modetoggle } from "./modetoggle";
import Link from "next/link";
import Image from "next/image";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";

const Header = () => {
	const { data: session } = useSession();
	return (
		<div className="block w-full h-16 bg-red-500 fixed z-10">
			<div className="mx-auto flex container items-center justify-between  px-8 pt-2 sm:pt-1 md-pt-0 sm:px-0">
				<Link
					href={"/"}
					className="text-4xl sm:text-5xl xl:text-6xl font-bold text-white font-mono"
				>
					VALO-LAB
				</Link>
				<div className="flex gap-4">
					{!session ? (
						<>
							<Button onClick={() => signIn()}>ログイン</Button>
						</>
					) : (
						<>
							{session?.user?.image && session?.user?.name ? (
								<>
									<HoverCard>
										<HoverCardTrigger>
											<Link href={"/mypage"}>
												<Image
													src={session.user.image}
													alt={session.user.name}
													width={100}
													height={100}
													className="rounded-full w-10 h-10" // 'rounded-ful' というtypoも修正
												/>
											</Link>
										</HoverCardTrigger>
										<HoverCardContent>
											<p className="text-lg">{session?.user?.name}</p>
											<p className="text-lg">{session?.user?.email}</p>
											<div className="flex justify-end mt-2">
												<button
													onClick={() => signOut()}
													className="border-2 px-2 py-1 rounded-md"
												>
													ログアウト
												</button>
											</div>
										</HoverCardContent>
									</HoverCard>
								</>
							) : (
								// フォールバックの表示内容
								<div className="w-[100px] h-[100px] bg-gray-200 rounded-full" />
							)}
						</>
					)}
					<Modetoggle />
				</div>
			</div>
		</div>
	);
};

export default Header;
