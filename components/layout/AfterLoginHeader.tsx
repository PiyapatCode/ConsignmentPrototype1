import Link from "next/link";

export default function AfterLoginHeader() {
	return (
		<header className="border-b border-[#ebe6f3] bg-white">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-8">
				<Link
					href="/"
					aria-label="อาร์ตแชร์ หน้าหลัก"
					className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6840c8]"
				>
					<span className="grid size-9 place-items-center rounded-xl bg-[#f0eaff] text-base font-bold text-[#6840c8]">
						อ
					</span>
					<span className="text-base font-semibold text-[#302447] sm:text-lg">อาร์ตแชร์</span>
				</Link>

				<nav aria-label="เมนูหลัก" className="flex items-center gap-0 sm:gap-4">
					<Link
						href="/sales-run"
						className="rounded-md px-1.5 py-2 text-xs font-medium text-[#625b70] transition-colors hover:text-[#6840c8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8] sm:px-3 sm:text-sm"
					>
						รอบขาย
					</Link>
					<Link
						href="/sales-run/create"
						className="rounded-md px-1.5 py-2 text-xs font-medium text-[#625b70] transition-colors hover:text-[#6840c8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8] sm:px-3 sm:text-sm"
					>
						<span className="sm:hidden">สร้าง</span>
						<span className="hidden sm:inline">สร้างรอบขาย</span>
					</Link>
					<span aria-hidden="true" className="hidden h-7 w-px bg-[#ebe6f3] sm:block" />
					<div className="flex items-center gap-2 sm:gap-3">
						<span className="grid size-8 place-items-center rounded-full bg-[#f0eaff] text-xs font-semibold text-[#6840c8]" aria-hidden="true">
							U
						</span>
						<span className="hidden text-sm font-medium text-[#393249] sm:inline">บัญชีผู้ใช้</span>
						<button
							type="button"
							className="rounded-md px-1.5 py-2 text-xs font-medium text-[#625b70] transition-colors hover:text-[#6840c8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8] sm:px-2 sm:text-sm"
						>
							ออกจากระบบ
						</button>
					</div>
				</nav>
			</div>
		</header>
	);
}
