import Link from "next/link";

const navigation = [
	{ href: "#features", label: "ฟีเจอร์" },
	{ href: "#how-it-works", label: "วิธีใช้งาน" },
	{ href: "#pricing", label: "ราคา" },
];

export default function LandingHeader() {
	return (
		<header className="sticky top-0 z-50 border-b border-[#ebe6f3] bg-white/95 backdrop-blur">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-8">
				<Link
					href="/"
					aria-label="อาร์ตแชร์ หน้าหลัก"
					className="flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6840c8]"
				>
					<span className="grid size-9 place-items-center bg-[#6840c8] text-lg font-bold text-white">
						อ
					</span>
					<span className="text-base font-semibold text-[#28213a] sm:text-lg">
						อาร์ตแชร์
					</span>
				</Link>

				<nav aria-label="เมนูหลัก" className="hidden items-center gap-7 md:flex">
					{navigation.map((item) => (
						<a
							key={item.href}
							href={item.href}
							className="text-sm font-medium text-[#665f73] transition-colors hover:text-[#6840c8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6840c8]"
						>
							{item.label}
						</a>
					))}
				</nav>

				<div className="flex shrink-0 items-center gap-2 sm:gap-3">
					<Link
						href="/auth/login"
						className="rounded-sm px-2 py-2 text-sm font-semibold text-[#514b60] transition-colors hover:text-[#6840c8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8] sm:px-3"
					>
						เข้าสู่ระบบ
					</Link>
					<Link
						href="/auth/register"
						className="rounded-sm bg-[#6840c8] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5633ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8] sm:px-4"
					>
						เริ่มใช้ฟรี
					</Link>
				</div>
			</div>
		</header>
	);
}
