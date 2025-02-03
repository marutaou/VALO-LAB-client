import MinemenuWindow from "../components/minemenuWindow";

export default function Home() {
	return (
		<div className="container justtify-center mx-auto pt-10">
			<h1 className="text-2xl font-bold px-6 sm:px-0">
				MAPを選択してください。
			</h1>
			<div className="flex items-center justify-center">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
					<MinemenuWindow contentName={"airstrike"} />
				</div>
			</div>
		</div>
	);
}
