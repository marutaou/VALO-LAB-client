"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldErrors } from "react-hook-form";
import { z } from "zod";
import React from "react";
import Image from "next/image";
//shadcn
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MypageTabList from "@/components/MypageTabList";
import apiClient from "@/lib/apiClient";

//zodでスキーマを作成
const formSchema = z.object({
	username: z
		.string()
		.min(1, "新しいユーザーネームを入力してください。")
		.max(20, "20文字以下にしてください。"),
});

function mypage() {
	const { data: session } = useSession();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log("送信データ:", values);
		try {
			const response = await apiClient.post("/users/username_change", {
				id: session?.user.id,
				newUsername: values.username,
			});
			console.log(response);
		} catch (error) {
			console.log(error);
		}
	};

	const onError = (errors: FieldErrors<z.infer<typeof formSchema>>) => {
		console.log(errors);
	};

	return (
		<>
			{session?.user?.image && session?.user?.name ? (
				<div className="container mx-auto mt-12">
					<div className="flex justify-end w-1/2 mx-auto mb-4">
						<Button onClick={() => signOut({ callbackUrl: "/" })}>
							ログアウト
						</Button>
					</div>

					<div className="flex flex-col justify-center items-center">
						<Image
							src={session.user.image}
							alt={session.user.name}
							width={1000}
							height={1000}
							className="rounded-full w-1/4 lg:w-1/6"
						/>
						<div className="flex mt-8 items-center gap-4">
							<h1 className="text-center text-3xl font-bold">
								{session.user.name}
							</h1>

							{/* ユーザーネーム編集ダイアログ */}
							<Dialog>
								<DialogTrigger>
									<FontAwesomeIcon
										icon={faPen}
										className="text-2xl transform hover:scale-125 duration-300"
									/>
								</DialogTrigger>
								<DialogContent className="max-w-[40vh]">
									<DialogHeader>
										<DialogTitle className="text-lg mb-2">
											新しいユーザーネームを入力してください。
										</DialogTitle>
									</DialogHeader>

									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(onSubmit, onError)}
											className="space-y-4"
										>
											<FormField
												control={form.control}
												name="username"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input id="username" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>
											<div className="w-full flex justify-end">
												<Button
													className="w-1/3"
													type="submit"
													disabled={form.formState.isSubmitting}
												>
													{form.formState.isSubmitting ? "送信中..." : "変更"}
												</Button>
											</div>
										</form>
									</Form>
								</DialogContent>
							</Dialog>
						</div>

						{/* タブメニュー */}
						<Tabs defaultValue="airstrike" className="w-1/2">
							<TabsList>
								<TabsTrigger value="airstrike">空爆</TabsTrigger>
								<TabsTrigger value="oneway">ワンウェイ</TabsTrigger>
							</TabsList>
							<TabsContent value="airstrike">
								<MypageTabList contentsName="airstrike" />
							</TabsContent>
							<TabsContent value="oneway">
								Change your password here.
							</TabsContent>
						</Tabs>
					</div>
				</div>
			) : (
				<div className="text-5xl text-center pt-4 font-bold">
					ログインしてください。
				</div>
			)}
		</>
	);
}

export default mypage;
