import React from "react";
import { Button } from "./ui/button-header";
import { Modetoggle } from "./modetoggle";
import Link from "next/link";

const header = () => {
	return (
		<div className="block w-screen h-16 bg-red-500 fixed z-10">
			<div className="mx-auto flex container items-center justify-between">
				<Link href={"/"} className="text-6xl font-bold text-white font-mono">
					VALO-LAB
				</Link>
				<div className="flex gap-4">
					<Button>ログイン</Button>
					<Button>ログアウト</Button>
					<Modetoggle />
				</div>
			</div>
		</div>
	);
};

export default header;
