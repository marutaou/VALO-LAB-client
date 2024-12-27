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

const header = () => {
	const { data: session } = useSession();

	return (
		<div className="block w-screen h-16 bg-red-500 fixed z-10">
			<div className="mx-auto flex container items-center justify-between">
				<Link href={"/"} className="text-6xl font-bold text-white font-mono">
					VALO-LAB
				</Link>
				<div className="flex gap-4">
					{!session ? (
						<>
							<Button onClick={() => signIn()}>ログイン</Button>
						</>
					) : (
						<>
							<div className="flex items-center">
								<p className="font-bold text-xl text-white">
									{session?.user?.name}
								</p>
							</div>
							{session?.user?.image && session?.user?.name ? (
								<>
									<HoverCard>
										<HoverCardTrigger>
											<Image
												src={session.user.image}
												alt={session.user.name}
												width={100}
												height={100}
												className="rounded-full w-10 h-10" // 'rounded-ful' というtypoも修正
											/>
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

export default header;
