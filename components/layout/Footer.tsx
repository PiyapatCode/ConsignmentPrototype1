import Link from "next/link";

export default function Footer() {
	return (
		<footer className="border-t border-[#eee8f7] bg-white">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 text-center text-xs text-[#817a8f] sm:px-6 sm:text-left lg:px-8">
				<div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
					<div>
						<p className="font-semibold text-[#383148]">© {new Date().getFullYear()} อาร์ตแชร์</p>
						<p className="mt-1">ระบบจัดการฝากขายและสรุปยอดงานศิลปะ</p>
					</div>
					<nav aria-label="ลิงก์ท้ายหน้า" className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-medium sm:justify-end">
						<Link href="/#features" className="transition-colors hover:text-[#6840c8]">ฟีเจอร์</Link>
						<Link href="/#pricing" className="transition-colors hover:text-[#6840c8]">ราคา</Link>
						<Link href="/#faq" className="transition-colors hover:text-[#6840c8]">คำถามที่พบบ่อย</Link>
						<Link href="/auth/login" className="transition-colors hover:text-[#6840c8]">เข้าสู่ระบบ</Link>
					</nav>
				</div>
			</div>
		</footer>
	);
}
