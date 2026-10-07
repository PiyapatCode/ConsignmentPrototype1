import Link from "next/link";
import LandingHeader from "../components/layout/LandingHeader";

const features = [
	{
		number: "01",
		title: "ขายไว ไม่สะดุดคิว",
		english: "Fast POS & inventory scanning",
		text: "สแกนรหัสผลงานเพื่อคิดเงินและตัดสต็อกทันที รองรับทั้งเงินสดและ QR พร้อมบันทึกทุกรายการขาย",
		accent: "#b94d32",
	},
	{
		number: "02",
		title: "ศิลปินเห็นยอดของตัวเอง",
		english: "A real-time artist dashboard",
		text: "ศิลปินตรวจสอบผลงานที่ขายได้และยอดส่วนแบ่งผ่านมือถือได้ โปร่งใส ตรวจสอบย้อนหลังได้ทุกชิ้น",
		accent: "#167d70",
	},
	{
		number: "03",
		title: "แบ่งยอดแม่นตามข้อตกลง",
		english: "Automatic commission & payout math",
		text: "ตั้งค่าคอมมิชชันแยกตามศิลปินหรือผลงาน ระบบคำนวณยอดสุทธิและส่วนแบ่งให้โดยอัตโนมัติ",
		accent: "#9b6d16",
	},
	{
		number: "04",
		title: "ปิดงานแล้วสรุปได้เลย",
		english: "One-click post-event reports",
		text: "รวมยอดขาย เงินสด QR ค่าคอมมิชชัน และยอดที่ต้องจ่ายให้ศิลปิน พร้อมส่งออกเป็น PDF หรือ Excel",
		accent: "#a78bda",
	},
];

const steps = [
	{
		number: "01",
		title: "ตั้งค่างานและเพิ่มผลงาน",
		text: "สร้างอีเวนต์ เพิ่มศิลปินและรายการสินค้า ตั้งราคา พร้อมกำหนดอัตราคอมมิชชันให้ชัดเจนก่อนเปิดบูท",
	},
	{
		number: "02",
		title: "สแกนขายหน้าบูท",
		text: "เลือกหรือสแกนผลงาน รับชำระด้วยเงินสดหรือ QR แล้วบันทึกการขายเข้าบัญชีรายการทันที",
	},
	{
		number: "03",
		title: "ตรวจยอดและจ่ายส่วนแบ่ง",
		text: "ดูยอดสุทธิของแต่ละศิลปิน ตรวจรายงาน แล้วชำระตามช่องทางที่ตกลงกันได้อย่างมั่นใจ",
	},
];

const plans = [
	{
		name: "ใช้งานฟรี",
		price: "ฟรี",
		period: "ไม่มีค่าใช้จ่าย",
		description: "ใช้เครื่องมือจัดการฝากขายได้โดยไม่เสียค่าสมัครหรือค่ารายอีเวนต์",
		features: ["จัดการอีเวนต์และผลงาน", "บันทึกยอดขายและคำนวณส่วนแบ่ง", "ดูสรุปและส่งออกรายงาน"],
		cta: "เริ่มใช้งานฟรี",
		href: "/auth/register",
	},
];

const questions = [
	{
		question: "ถ้าอินเทอร์เน็ตในงานไม่เสถียร ระบบยังขายได้ไหม?",
		answer:
			"ต้นแบบนี้ต้องใช้อินเทอร์เน็ตเพื่อบันทึกและซิงก์รายการขาย จึงควรเตรียมเครือข่ายสำรองหรือฮอตสปอตไว้ก่อน หากต้องการใช้งานออฟไลน์ โปรดติดต่อทีมเพื่อวางแผนความต้องการก่อนเปิดใช้จริง",
	},
	{
		question: "ระบบโอนเงินให้ศิลปินโดยอัตโนมัติหรือไม่?",
		answer:
			"ระบบช่วยคำนวณ แยกยอด และจัดทำรายงานสำหรับการชำระเงิน แต่ไม่ได้ถือเงินหรือโอนเงินแทนผู้จัดบูท ผู้จัดตรวจสอบยอดก่อนชำระผ่านช่องทางที่ตกลงกับศิลปิน",
	},
	{
		question: "กำหนดคอมมิชชันไม่เท่ากันในแต่ละศิลปินได้ไหม?",
		answer:
			"ได้ สามารถตั้งอัตราตามข้อตกลงของแต่ละศิลปินหรือแต่ละผลงาน และตรวจยอดส่วนแบ่งที่ระบบคำนวณได้ก่อนปิดงาน",
	},
	{
		question: "ส่งออกข้อมูลหลังจบงานได้หรือไม่?",
		answer:
			"ได้ โดยดูสรุปยอดขายและส่วนแบ่ง พร้อมส่งออกรายงาน PDF หรือ Excel สำหรับตรวจสอบและทำบัญชีต่อ",
	},
];

function SectionHeading({
	eyebrow,
	title,
	text,
}: {
	eyebrow: string;
	title: string;
	text?: string;
}) {
	return (
		<div className="max-w-2xl">
			<p className="mb-3 text-xs font-bold uppercase text-[#6840c8] sm:text-sm">
				{eyebrow}
			</p>
			<h2 className="text-3xl font-semibold leading-tight text-[#28213a] sm:text-4xl">
				{title}
			</h2>
			{text && <p className="mt-4 text-base leading-7 text-[#665f73]">{text}</p>}
		</div>
	);
}

export default function Home() {
	return (
		<div className="flex min-h-0 flex-1 flex-col bg-white text-[#28213a]">
			<LandingHeader />

			<main className="flex-1">
				<section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-[1.03fr_0.97fr] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-16">
					<div className="max-w-2xl">
						<div className="mb-6 inline-flex items-center gap-2 border border-[#e5ddf2] bg-[#faf8fe] px-3 py-1.5 text-xs font-semibold text-[#5e566d] sm:text-sm">
							<span className="size-2 rounded-full bg-[#167d70]" />
							ระบบจัดการฝากขายสำหรับบูทและศิลปิน
						</div>
						<h1 className="max-w-[720px] text-4xl font-semibold leading-[1.13] text-[#28213a] sm:text-5xl lg:text-[58px]">
							ขายงานศิลป์คล่องตัว
							<br className="hidden sm:block" />
							<span className="text-[#6840c8]"> สรุปยอดตรง</span>
							<br className="hidden sm:block" />
							ศิลปินไว้ใจได้
						</h1>
						<p className="mt-6 max-w-xl text-base leading-7 text-[#514b60] sm:text-lg sm:leading-8">
							อาร์ตแชร์ช่วยบูทจัดการผลงานฝากขาย บันทึกยอดขาย และคำนวณส่วนแบ่งให้เป็นระบบในที่เดียว
							ศิลปินติดตามรายการขายของตัวเองได้ โปร่งใสตั้งแต่รับผลงานจนถึงสรุปยอดหลังจบงาน
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
							<Link
								href="/auth/register"
								className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#6840c8] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5633ac] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#6840c8]"
							>
								สร้างบูทของคุณฟรี <span aria-hidden="true">→</span>
							</Link>
							<a
								href="#how-it-works"
								className="inline-flex min-h-12 items-center justify-center px-4 py-3 text-sm font-semibold text-[#514b60] underline decoration-[#cfc5e1] underline-offset-4 transition-colors hover:text-[#6840c8] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#6840c8]"
							>
								ดูวิธีใช้งาน
							</a>
						</div>
						<div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#ebe6f3] pt-5 text-xs text-[#70697d] sm:text-sm">
							<span className="font-semibold text-[#383148]">ออกแบบมาสำหรับ</span>
							<span>บูทคอนเวนชัน</span>
							<span aria-hidden="true" className="text-[#6840c8]">•</span>
							<span>ตลาดงานอาร์ต</span>
							<span aria-hidden="true" className="text-[#6840c8]">•</span>
							<span>ครีเอเตอร์</span>
						</div>
					</div>

					<div className="relative mx-auto w-full max-w-xl lg:max-w-none">
						<div
							role="img"
							aria-label="ภาพวาดสีน้ำมันจัดแสดงในแกลเลอรี"
							className="relative aspect-[4/3] overflow-hidden bg-[#e9e3f2] sm:aspect-[1.12/1]"
							style={{
								backgroundImage:
									"linear-gradient(180deg, rgba(24, 25, 22, 0.02) 40%, rgba(24, 25, 22, 0.52) 100%), url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1600&q=85')",
								backgroundPosition: "center 45%",
								backgroundSize: "cover",
							}}
						>
							<div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
								<p className="text-xs font-semibold uppercase text-white/80">
									สำหรับคนทำงานสร้างสรรค์
								</p>
								<p className="mt-2 max-w-sm text-2xl font-semibold leading-tight sm:text-3xl">
									ให้ผลงานได้ไปต่อ
									<br />
									โดยไม่ทิ้งความโปร่งใสไว้ข้างหลัง
								</p>
							</div>
						</div>
						<div className="absolute right-2 top-3 w-[min(78%,260px)] border border-[#e8e1f1] bg-white p-4 shadow-[0_16px_40px_-24px_rgba(45,32,72,0.28)] sm:-right-4 sm:top-8 sm:p-5 lg:-right-6">
							<div className="flex items-center justify-between gap-3">
								<p className="text-xs font-semibold text-[#514b60]">ยอดขายในงาน</p>
								<span className="bg-[#e5f2ec] px-2 py-1 text-[10px] font-semibold text-[#27654f]">
									ตัวอย่างข้อมูล
								</span>
							</div>
							<p className="mt-2 text-2xl font-semibold text-[#28213a]">฿8,450</p>
							<div className="mt-4 space-y-3 border-t border-[#eee9df] pt-3">
								<div className="flex items-center justify-between gap-2 text-xs">
									<span className="text-[#777166]">ยอดศิลปินรับ</span>
									<span className="font-semibold text-[#167d70]">฿7,605</span>
								</div>
								<div className="flex items-center justify-between gap-2 text-xs">
									<span className="text-[#777166]">ค่าคอมมิชชันบูท</span>
									<span className="font-semibold text-[#28213a]">฿845</span>
								</div>
							</div>
							<div className="mt-4 flex items-center gap-2 text-[11px] text-[#777166]">
								<span className="size-2 rounded-full bg-[#167d70]" />
								<span>คำนวณส่วนแบ่งอัตโนมัติ</span>
							</div>
						</div>
					</div>
				</section>

				<section className="border-y border-[#ebe6f3] bg-[#faf9fc] py-6" aria-label="ประโยชน์หลัก">
					<div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
						{[
							["ขาย", "สแกนรายการได้ทันที"],
							["ติดตาม", "เห็นยอดตามจริง"],
							["คำนวณ", "แยกส่วนแบ่งชัดเจน"],
							["สรุป", "พร้อมปิดยอดหลังงาน"],
						].map(([title, text]) => (
							<div key={title} className="border-l-2 border-[#6840c8] pl-3 sm:pl-4">
								<p className="text-base font-semibold text-[#28213a] sm:text-lg">{title}</p>
								<p className="mt-1 text-xs leading-5 text-[#777166] sm:text-sm">{text}</p>
							</div>
						))}
					</div>
				</section>

				<section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="before-after-title">
					<div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
						<SectionHeading
							eyebrow="ก่อนและหลัง"
							title="งานยุ่งแค่ไหน ก็ยังรู้ว่ายอดอยู่ตรงไหน"
							text="เปลี่ยนจากการไล่เช็กกระดาษและหลายไฟล์ ให้ทุกคนทำงานบนข้อมูลชุดเดียวกัน"
						/>
						<span id="before-after-title" className="sr-only">เปรียบเทียบวิธีจัดการฝากขาย</span>
					</div>
					<div className="mt-9 grid gap-px border border-[#e5deef] bg-[#e5deef] md:grid-cols-2">
						<div className="bg-[#f5f3f8] p-6 sm:p-8">
							<p className="text-xs font-bold uppercase text-[#625a70]">แบบเดิม · จดมือและสเปรดชีต</p>
							<h3 className="mt-3 text-xl font-semibold text-[#383148]">ขายเพลิน แต่ยอดตามไม่ทัน</h3>
							<ul className="mt-5 space-y-3 text-sm leading-6 text-[#625c70]">
								<li className="flex gap-3"><span className="text-[#6840c8]">×</span><span>จดรายการไม่ทันช่วงคนแน่น สต็อกกับของจริงไม่ตรงกัน</span></li>
								<li className="flex gap-3"><span className="text-[#6840c8]">×</span><span>เงินสดและ QR ปะปน ตรวจยอดและแบ่งค่าคอมยาก</span></li>
								<li className="flex gap-3"><span className="text-[#6840c8]">×</span><span>ศิลปินต้องรอถาม ไม่เห็นสถานะผลงานของตัวเอง</span></li>
								<li className="flex gap-3"><span className="text-[#6840c8]">×</span><span>หลังงานต้องไล่รวมข้อมูลทีละแถว เสี่ยงตกหล่น</span></li>
							</ul>
						</div>
						<div className="bg-[#eee9f8] p-6 sm:p-8">
							<p className="text-xs font-bold uppercase text-[#6840c8]">อาร์ตแชร์ · บันทึกและสรุปในระบบ</p>
							<h3 className="mt-3 text-xl font-semibold text-[#302546]">ทุกยอดมีรายการอ้างอิง</h3>
							<ul className="mt-5 space-y-3 text-sm leading-6 text-[#514b60]">
								<li className="flex gap-3"><span className="text-[#167d70]">✓</span><span>สแกนผลงานแล้วบันทึกยอดขายและสต็อกทันที</span></li>
								<li className="flex gap-3"><span className="text-[#167d70]">✓</span><span>แยกช่องทางชำระและคำนวณคอมมิชชันตามข้อตกลง</span></li>
								<li className="flex gap-3"><span className="text-[#167d70]">✓</span><span>ศิลปินติดตามยอดผลงานของตัวเองได้จากมือถือ</span></li>
								<li className="flex gap-3"><span className="text-[#167d70]">✓</span><span>สรุปยอดและส่งออกรายงานได้เมื่อจบอีเวนต์</span></li>
							</ul>
						</div>
					</div>
				</section>

				<section id="features" className="scroll-mt-24 bg-[#302546] py-16 text-white sm:py-20" aria-labelledby="features-title">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="max-w-2xl">
							<p className="mb-3 text-xs font-bold uppercase text-[#cbb7f3] sm:text-sm">เครื่องมือที่คิดมาเพื่องานจริง</p>
							<h2 id="features-title" className="text-3xl font-semibold leading-tight sm:text-4xl">ยอดขายชัดเจน ความสัมพันธ์ก็ชัดเจน</h2>
							<p className="mt-4 text-base leading-7 text-white/70">ตั้งแต่สแกนขายหน้าบูทไปจนถึงยอดสุทธิของศิลปิน ทุกขั้นมีข้อมูลให้ตรวจสอบ</p>
						</div>
						<div className="mt-10 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
							{features.map((feature) => (
								<article key={feature.number} className="border-t border-white/20 py-6 sm:py-7">
									<p className="text-sm font-semibold" style={{ color: feature.accent }}>{feature.number}</p>
									<h3 className="mt-4 text-lg font-semibold leading-snug text-white">{feature.title}</h3>
									<p className="mt-1 text-xs font-medium leading-5 text-white/55">{feature.english}</p>
									<p className="mt-4 text-sm leading-6 text-white/70">{feature.text}</p>
								</article>
							))}
						</div>
					</div>
				</section>

				<section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8" aria-labelledby="how-it-works">
					<div className="lg:sticky lg:top-28 lg:self-start">
						<SectionHeading
							eyebrow="เริ่มใช้งานได้ไม่ซับซ้อน"
							title="สามขั้นตอน จากรับฝากถึงปิดยอด"
							text="ระบบพาทีมและศิลปินเห็นข้อมูลตรงกัน ตั้งแต่ก่อนเปิดบูทจนถึงหลังงานจบ"
						/>
						<a href="#pricing" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6840c8] underline underline-offset-4 hover:text-[#50319b]">
							ดูแพ็กเกจ <span aria-hidden="true">→</span>
						</a>
					</div>
					<div id="how-it-works" className="scroll-mt-28">
						{steps.map((step, index) => (
							<article key={step.number} className="grid grid-cols-[48px_1fr] gap-4 border-t border-[#e4dccf] py-6 sm:grid-cols-[64px_1fr] sm:gap-6 sm:py-8">
								<span className={`grid size-11 place-items-center text-sm font-bold sm:size-14 ${index === 1 ? "bg-[#6840c8] text-white" : "bg-[#eee9f8] text-[#51456b]"}`}>
									{step.number}
								</span>
								<div>
									<h3 className="text-lg font-semibold sm:text-xl">{step.title}</h3>
									<p className="mt-2 max-w-xl text-sm leading-6 text-[#696359]">{step.text}</p>
								</div>
							</article>
						))}
						<div className="border-t border-[#e4dccf] pt-5 text-xs leading-5 text-[#777166]">
							การจ่ายเงินจริงดำเนินการโดยผู้จัดบูทผ่านช่องทางที่ตกลงกัน ระบบช่วยคำนวณและจัดทำข้อมูลประกอบการชำระ
						</div>
					</div>
				</section>

				<section className="border-y border-[#e7dfd1] bg-white py-16 sm:py-20" aria-labelledby="testimonials-title">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<SectionHeading
							eyebrow="ความโปร่งใสคือจุดเริ่มต้น"
							title="ทุกฝ่ายเห็นข้อตกลงและยอดเดียวกัน"
						/>
						<div className="mt-9 grid gap-5 md:grid-cols-2">
							<article className="border-l-4 border-[#6840c8] bg-[#f8f6fb] p-6 sm:p-8">
								<p className="text-xs font-bold uppercase text-[#6840c8]">ตัวอย่างข้อความรีวิว · ผู้จัดบูท</p>
								<blockquote className="mt-4 text-lg font-medium leading-8 text-[#383148]">
									“ไม่ต้องกลับมานั่งไล่กระดาษทีละใบหลังงาน ปิดยอดและเช็กส่วนแบ่งของแต่ละคนได้จากรายงานเดียว”
								</blockquote>
								<p className="mt-5 text-sm text-[#70697d]">ผู้จัดบูทงานอาร์ต · ข้อความตัวอย่าง รอแทนที่ด้วยรีวิวจริง</p>
							</article>
							<article className="border-l-4 border-[#9b82cb] bg-[#f1eef7] p-6 sm:p-8">
								<p className="text-xs font-bold uppercase text-[#604594]">ตัวอย่างข้อความรีวิว · ศิลปิน</p>
								<blockquote className="mt-4 text-lg font-medium leading-8 text-[#383148]">
									“เช็กได้ว่าชิ้นไหนขายแล้วและได้ส่วนแบ่งเท่าไร คุยกับบูทง่ายขึ้นเพราะมีรายการให้ดูตรงกัน”
								</blockquote>
								<p className="mt-5 text-sm text-[#70697d]">ศิลปินอิสระ · ข้อความตัวอย่าง รอแทนที่ด้วยรีวิวจริง</p>
							</article>
						</div>
						<p id="testimonials-title" className="sr-only">ตัวอย่างรีวิวจากผู้จัดบูทและศิลปิน</p>
					</div>
				</section>

				<section id="pricing" className="scroll-mt-24 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="pricing-title">
					<div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
						<div>
							<SectionHeading
								eyebrow="ไม่มีค่าใช้จ่าย"
								title="เครื่องมือครบ ใช้งานฟรี"
								text="ไม่มีค่าสมัคร ไม่มีค่ารายอีเวนต์ เริ่มจัดการผลงานและยอดขายได้เลย"
							/>
						</div>
					</div>
						<div className="mt-9 grid gap-4 sm:grid-cols-2">
						{plans.map((plan) => (
								<article key={plan.name} className="flex w-full max-w-xl flex-col border border-[#6840c8] bg-[#f8f6fb] p-6 sm:p-7">
								<div className="flex items-start justify-between gap-3">
									<h3 className="text-lg font-semibold">{plan.name}</h3>
										<span className="bg-[#6840c8] px-2 py-1 text-[10px] font-semibold text-white">ฟรีตลอด</span>
								</div>
								<p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
									<span className="text-3xl font-semibold">{plan.price}</span>
									<span className="text-xs text-[#70697d]">{plan.period}</span>
								</p>
								<p className="mt-3 min-h-12 text-sm leading-6 text-[#625c70]">{plan.description}</p>
								<ul className="mt-5 space-y-3 border-t border-[#e5deef] pt-5 text-sm text-[#514b60]">
									{plan.features.map((feature) => <li key={feature} className="flex gap-2"><span className="font-bold text-[#167d70]">✓</span><span>{feature}</span></li>)}
								</ul>
								<Link href={plan.href} className="mt-7 inline-flex min-h-11 items-center justify-center bg-[#6840c8] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5633ac] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#6840c8]">
									{plan.cta}
								</Link>
							</article>
						))}
					</div>
				</section>

				<section className="bg-[#eee9f8] py-16 sm:py-20" aria-labelledby="final-cta-title">
					<div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
						<div className="max-w-2xl">
							<p className="mb-3 text-xs font-bold uppercase text-[#6840c8] sm:text-sm">งานศิลป์ควรได้ไปต่อ ความไว้ใจควรไปด้วยกัน</p>
							<h2 id="final-cta-title" className="text-3xl font-semibold leading-tight text-[#302546] sm:text-4xl">พร้อมให้งานถัดไปจัดการง่ายกว่าเดิมไหม?</h2>
							<p className="mt-4 text-base leading-7 text-[#514b60]">เริ่มจัดการผลงาน ยอดขาย และส่วนแบ่งได้ในที่เดียว</p>
						</div>
						<Link href="/auth/register" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[#6840c8] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5633ac] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#6840c8]">
							สร้างบูทของคุณฟรี <span aria-hidden="true">→</span>
						</Link>
					</div>
				</section>

				<section id="faq" className="scroll-mt-24 mx-auto grid w-full max-w-7xl gap-9 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 lg:px-8" aria-labelledby="faq-title">
					<div>
						<SectionHeading
							eyebrow="คำถามที่พบบ่อย"
							title="ก่อนเริ่มใช้งาน"
							text="รายละเอียดสำคัญสำหรับผู้จัดบูทและศิลปินที่ทำงานร่วมกัน"
						/>
						<span id="faq-title" className="sr-only">คำถามเกี่ยวกับการใช้งานและการชำระเงิน</span>
					</div>
					<div>
						{questions.map((item) => (
							<details key={item.question} className="group border-t border-[#e5deef] py-4 last:border-b">
								<summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-1 text-sm font-semibold leading-6 text-[#383148] marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6840c8] [&::-webkit-details-marker]:hidden">
									{item.question}
									<span aria-hidden="true" className="shrink-0 text-lg font-normal text-[#6840c8] transition-transform group-open:rotate-45">+</span>
								</summary>
								<p className="max-w-3xl pt-3 pr-7 text-sm leading-6 text-[#625c70]">{item.answer}</p>
							</details>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
