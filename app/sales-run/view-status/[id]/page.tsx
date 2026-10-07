"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { getServerStaffInvitesSnapshot, getStaffInvitesSnapshot, subscribeToStaffInvites } from "../../../../lib/staffInvites";

type ItemSale = {
	id: string;
	time: string;
	quantity: number;
	channel: string;
};

type StockItem = {
	id: string;
	name: string;
	initialStock: number;
	stockLeft: number;
	price: number;
	sales: ItemSale[];
};

type SupplierStock = {
	id: string;
	name: string;
	items: StockItem[];
};

type SalesLogEntry = ItemSale & {
	itemName: string;
	supplierName: string;
	amount: number;
};

const supplierStock: SupplierStock[] = [
	{
		id: "mali-studio",
		name: "Mali Studio",
		items: [
			{
				id: "postcard",
				name: "โปสการ์ดสวนดอกไม้",
				initialStock: 30,
				stockLeft: 24,
				price: 120,
				sales: [
					{ id: "postcard-1", time: "14:32", quantity: 2, channel: "QR" },
					{ id: "postcard-2", time: "13:58", quantity: 1, channel: "เงินสด" },
					{ id: "postcard-3", time: "12:41", quantity: 3, channel: "QR" },
				],
			},
			{
				id: "cat-sticker",
				name: "สติกเกอร์ชุดแมว",
				initialStock: 40,
				stockLeft: 31,
				price: 85,
				sales: [
					{ id: "sticker-1", time: "14:18", quantity: 4, channel: "เงินสด" },
					{ id: "sticker-2", time: "13:37", quantity: 2, channel: "QR" },
					{ id: "sticker-3", time: "11:52", quantity: 3, channel: "QR" },
				],
			},
		],
	},
	{
		id: "northstar-art",
		name: "Northstar Art",
		items: [
			{
				id: "acrylic-keychain",
				name: "พวงกุญแจอะคริลิก",
				initialStock: 16,
				stockLeft: 12,
				price: 180,
				sales: [
					{ id: "keychain-1", time: "13:56", quantity: 1, channel: "QR" },
					{ id: "keychain-2", time: "12:24", quantity: 2, channel: "เงินสด" },
					{ id: "keychain-3", time: "11:18", quantity: 1, channel: "QR" },
				],
			},
		],
	},
	{
		id: "booth-items",
		name: "สินค้าของบูท",
		items: [
			{
				id: "mini-book",
				name: "สมุดภาพเล่มเล็ก",
				initialStock: 10,
				stockLeft: 8,
				price: 250,
				sales: [
					{ id: "book-1", time: "13:41", quantity: 1, channel: "เงินสด" },
					{ id: "book-2", time: "10:47", quantity: 1, channel: "QR" },
				],
			},
		],
	},
];

function formatCurrency(value: number) {
	return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(value);
}

function StockProgress({ item }: { item: StockItem }) {
	const sold = item.initialStock - item.stockLeft;
	const soldPercent = item.initialStock > 0 ? Math.round((sold / item.initialStock) * 100) : 0;
	const remainingPercent = item.initialStock > 0 ? (item.stockLeft / item.initialStock) * 100 : 0;
	const progressTone = item.stockLeft <= 3 ? "bg-[#b94d32]" : "bg-[#6840c8]";

	return (
		<div>
			<div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs">
				<span className="font-medium text-[#514b60]">ขายแล้ว {sold} / {item.initialStock} ชิ้น</span>
				<span className="text-[#817a8f]">{soldPercent}% ขายแล้ว</span>
			</div>
			<div
				role="progressbar"
				aria-label={`ขายแล้ว ${sold} จาก ${item.initialStock} ชิ้น`}
				aria-valuemin={0}
				aria-valuemax={item.initialStock}
				aria-valuenow={sold}
				className="h-2.5 overflow-hidden rounded-full bg-[#eeeaf3]"
			>
				<div className={`h-full rounded-full transition-[width] ${progressTone}`} style={{ width: `${100 - remainingPercent}%` }} />
			</div>
		</div>
	);
}

function SupplierSection({ supplier }: { supplier: SupplierStock }) {
	const supplierRemaining = supplier.items.reduce((total, item) => total + item.stockLeft, 0);
	const supplierSales = supplier.items.reduce((total, item) => total + item.initialStock - item.stockLeft, 0);

	return (
		<details className="group border border-[#e9e3f2] bg-white">
			<summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 bg-white px-4 py-3 text-[#383148] transition-colors hover:bg-[#faf9fc] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#6840c8] [&::-webkit-details-marker]:hidden sm:px-5">
				<span className="font-semibold">{supplier.name}</span>
				<span aria-hidden="true" className="text-lg text-[#6840c8] transition-transform group-open:rotate-45">+</span>
			</summary>
			<div className="border-t border-[#ebe6f3]">
				<header className="flex flex-wrap items-center justify-between gap-3 bg-[#faf9fc] px-4 py-3 sm:px-5">
					<p className="text-xs text-[#817a8f]">{supplier.items.length} รายการสินค้า</p>
					<p className="text-xs text-[#70697d]">ขายแล้ว {supplierSales} <span aria-hidden="true">·</span> เหลือ {supplierRemaining}</p>
				</header>
				<div className="divide-y divide-[#f0edf4]">
					{supplier.items.map((item) => (
						<article key={item.id} className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(180px,0.8fr)_140px] sm:items-start sm:p-5">
							<div className="min-w-0">
								<h3 className="font-medium text-[#383148]">{item.name}</h3>
								<p className="mt-1 text-xs text-[#817a8f]">ราคา {formatCurrency(item.price)} · เริ่มต้น {item.initialStock} ชิ้น</p>
							</div>
							<StockProgress item={item} />
							<div className="flex items-center justify-between gap-3 sm:justify-end">
								<div className="sm:text-right">
									<p className="text-[10px] font-medium text-[#817a8f]">คงเหลือ</p>
									<p className={`text-xl font-semibold ${item.stockLeft <= 3 ? "text-[#b94d32]" : "text-[#28213a]"}`}>{item.stockLeft} <span className="text-xs font-normal text-[#817a8f]">ชิ้น</span></p>
								</div>
								{item.stockLeft <= 3 && <span className="bg-[#fbf1ed] px-2 py-1 text-[10px] font-semibold text-[#a3412d]">ใกล้หมด</span>}
							</div>
						</article>
					))}
				</div>
			</div>
		</details>
	);
}

function SalesLog({ entries }: { entries: SalesLogEntry[] }) {
	return (
		<section aria-labelledby="combined-sales-log" className="mt-7">
			<div className="mb-4 flex flex-wrap items-end justify-between gap-3">
				<div>
					<p className="text-xs font-semibold uppercase text-[#6840c8]">ประวัติรายการ</p>
					<h2 id="combined-sales-log" className="mt-1 text-xl font-semibold text-[#28213a]">ประวัติการขายทั้งหมด</h2>
				</div>
				<p className="text-xs text-[#817a8f]">{entries.length} รายการ · เรียงจากล่าสุด</p>
			</div>
			<div className="overflow-x-auto border border-[#e9e3f2] bg-white">
				<table className="w-full min-w-[680px] text-left text-sm">
					<thead className="bg-[#faf9fc] text-xs text-[#70697d]">
						<tr>
							<th className="px-4 py-3 font-medium">เวลา</th>
							<th className="px-4 py-3 font-medium">สินค้า</th>
							<th className="px-4 py-3 font-medium">ซัพพลายเออร์</th>
							<th className="px-4 py-3 text-center font-medium">จำนวน</th>
							<th className="px-4 py-3 font-medium">ชำระด้วย</th>
							<th className="px-4 py-3 text-right font-medium">ยอดขาย</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[#f0edf4]">
						{entries.map((entry) => (
							<tr key={entry.id}>
								<td className="whitespace-nowrap px-4 py-3 text-[#817a8f]">วันนี้ {entry.time}</td>
								<td className="px-4 py-3 font-medium text-[#383148]">{entry.itemName}</td>
								<td className="px-4 py-3 text-[#70697d]">{entry.supplierName}</td>
								<td className="px-4 py-3 text-center text-[#514b60]">{entry.quantity}</td>
								<td className="px-4 py-3"><span className="rounded-full bg-[#f1eef8] px-2.5 py-1 text-xs text-[#604594]">{entry.channel}</span></td>
								<td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[#28213a]">{formatCurrency(entry.amount)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}

export default function ViewSalesRunStatusPage() {
	const { id } = useParams<{ id: string }>();
	const searchParams = useSearchParams();
	const inviteId = searchParams.get("invite");
	const runInvites = useSyncExternalStore(subscribeToStaffInvites, getStaffInvitesSnapshot, getServerStaffInvitesSnapshot).filter((invite) => invite.runId === id);
	const viewerInvite = inviteId ? runInvites.find((invite) => invite.id === inviteId) : undefined;
	const products = supplierStock.flatMap((supplier) => supplier.items);
	const salesLog = supplierStock.flatMap((supplier) => supplier.items.flatMap((item) => item.sales.map((sale) => ({
		...sale,
		itemName: item.name,
		supplierName: supplier.name,
		amount: sale.quantity * item.price,
	})))).sort((first, second) => second.time.localeCompare(first.time));
	const totalInitial = products.reduce((total, item) => total + item.initialStock, 0);
	const totalRemaining = products.reduce((total, item) => total + item.stockLeft, 0);
	const totalSold = totalInitial - totalRemaining;
	const totalSalesValue = products.reduce((total, item) => total + (item.initialStock - item.stockLeft) * item.price, 0);

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-[#f6f4fa] text-[#28213a]">
			<header className="border-b border-[#ebe6f3] bg-white">
				<div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:min-h-[72px] sm:px-6 lg:px-8">
					<Link href="/" className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6840c8]" aria-label="อาร์ตแชร์ หน้าหลัก">
						<span className="grid size-9 place-items-center rounded-xl bg-[#f0eaff] text-base font-bold text-[#6840c8]" aria-hidden="true">อ</span>
						<span className="text-base font-semibold text-[#302447] sm:text-lg">อาร์ตแชร์</span>
					</Link>
					<div className="flex items-center gap-3">
						{viewerInvite && (viewerInvite.role === "ผู้จัดการ" || viewerInvite.role === "พนักงานขาย") && <Link href={`/sales-run/onGoing/${encodeURIComponent(id)}?invite=${encodeURIComponent(viewerInvite.id)}`} className="text-xs font-semibold text-[#6840c8] hover:underline">ไปหน้าจัดการรอบขาย</Link>}
						<span className="rounded-full bg-[#f1eef8] px-3 py-1.5 text-xs font-semibold text-[#604594]">{viewerInvite ? viewerInvite.role === "pending" ? "รออนุมัติ · ดูข้อมูลเท่านั้น" : viewerInvite.role : "สิทธิ์ดูข้อมูล"}</span>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
				<header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<p className="text-xs font-semibold uppercase text-[#6840c8]">สถานะรอบขาย · #{id}</p>
						<h1 className="mt-1 text-2xl font-semibold text-[#28213a] sm:text-3xl">สถานะสต็อกสินค้า</h1>
						<p className="mt-2 text-sm text-[#70697d]">ตรวจดูยอดคงเหลือและประวัติการขายแยกตามซัพพลายเออร์</p>
					</div>
					<p className="self-start border border-[#e5deef] bg-white px-3 py-2 text-xs text-[#817a8f] sm:self-auto">ข้อมูลตัวอย่าง · อัปเดตวันนี้ 14:32</p>
				</header>

				<div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
					<Summary label="จำนวนสินค้าเริ่มต้น" value={`${totalInitial} ชิ้น`} />
					<Summary label="ขายไปแล้ว" value={`${totalSold} ชิ้น`} tone="purple" />
					<Summary label="คงเหลือ" value={`${totalRemaining} ชิ้น`} tone="green" />
					<Summary label="ยอดขายของสินค้าฝาก" value={formatCurrency(totalSalesValue)} />
				</div>
				{viewerInvite && <p className="mt-4 border border-[#e5deef] bg-white px-4 py-3 text-xs leading-5 text-[#70697d]">{viewerInvite.role === "pending" ? `สวัสดี ${viewerInvite.name} คุณกำลังดูข้อมูลสต็อกแบบอ่านอย่างเดียว คำขอสิทธิ์ทีมรอเจ้าของรอบขายอนุมัติ` : `สวัสดี ${viewerInvite.name} เจ้าของรอบขายกำหนดสิทธิ์ให้คุณเป็น${viewerInvite.role}แล้ว`}{viewerInvite.role !== "pending" && !viewerInvite.canEndSalesRun ? " คุณยังไม่ได้รับอนุญาตให้จบรอบขาย" : ""}</p>}

				<div className="mt-7 flex flex-col gap-4">
					{supplierStock.map((supplier) => <SupplierSection key={supplier.id} supplier={supplier} />)}
				</div>
				<SalesLog entries={salesLog} />
				<p className="mt-4 text-xs leading-5 text-[#817a8f]">หน้านี้เป็นสิทธิ์ดูข้อมูลเท่านั้น ข้อมูลสินค้าและรายการขายเป็นตัวอย่างสำหรับต้นแบบ</p>
			</main>
		</div>
	);
}

function Summary({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "purple" | "green" }) {
	const valueTone = tone === "purple" ? "text-[#6840c8]" : tone === "green" ? "text-[#167d70]" : "text-[#28213a]";
	return (
		<div className="border border-[#e9e3f2] bg-white p-4 sm:p-5">
			<p className="text-xs font-medium text-[#70697d]">{label}</p>
			<p className={`mt-2 text-xl font-semibold sm:text-2xl ${valueTone}`}>{value}</p>
		</div>
	);
}
