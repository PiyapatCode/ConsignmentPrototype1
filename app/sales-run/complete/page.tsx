"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import AfterLoginHeader from "../../../components/layout/AfterLoginHeader";
import {
	getSalesRunsSnapshot,
	getServerSalesRunsSnapshot,
	subscribeToSalesRuns,
	type SalesRunRecord,
} from "../../../lib/salesRuns";

type ActivityView = "sales" | "summary" | "expenses";

type ReportSale = {
	id: string;
	time: string;
	item: string;
	supplier: string;
	quantity: number;
	amount: number;
	channel: string;
};

type ReportExpense = {
	name: string;
	amount: number;
};

type SupplierFinancial = {
	name: string;
	sales: number;
	expense: number;
	netAfterExpense: number;
};

const reportSales: ReportSale[] = [
	{ id: "sale-1", time: "14:32", item: "โปสการ์ดสวนดอกไม้", supplier: "Mali Studio", quantity: 2, amount: 240, channel: "QR" },
	{ id: "sale-2", time: "14:18", item: "สติกเกอร์ชุดแมว", supplier: "Mali Studio", quantity: 1, amount: 85, channel: "เงินสด" },
	{ id: "sale-3", time: "13:56", item: "พวงกุญแจอะคริลิก", supplier: "Northstar Art", quantity: 1, amount: 180, channel: "QR" },
	{ id: "sale-4", time: "13:41", item: "สมุดภาพเล่มเล็ก", supplier: "สินค้าของบูท", quantity: 1, amount: 250, channel: "เงินสด" },
	{ id: "sale-5", time: "12:41", item: "โปสการ์ดสวนดอกไม้", supplier: "Mali Studio", quantity: 3, amount: 360, channel: "QR" },
];

const reportExpenses: ReportExpense[] = [
	{ name: "ค่าเช่าพื้นที่", amount: 1200 },
	{ name: "อุปกรณ์จัดบูท", amount: 350 },
];

const stockSummary = [
	{ item: "โปสการ์ดสวนดอกไม้", supplier: "Mali Studio", opening: 30, sold: 6, remaining: 24 },
	{ item: "สติกเกอร์ชุดแมว", supplier: "Mali Studio", opening: 40, sold: 9, remaining: 31 },
	{ item: "พวงกุญแจอะคริลิก", supplier: "Northstar Art", opening: 16, sold: 4, remaining: 12 },
	{ item: "สมุดภาพเล่มเล็ก", supplier: "สินค้าของบูท", opening: 10, sold: 2, remaining: 8 },
];

function currency(value: number) {
	return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(value);
}

function ActivityTabs({ active, onChange }: { active: ActivityView; onChange: (view: ActivityView) => void }) {
	const tabs: { id: ActivityView; label: string }[] = [
		{ id: "sales", label: "รายการขาย" },
		{ id: "summary", label: "กำไรและสต็อก" },
		{ id: "expenses", label: "ค่าใช้จ่าย" },
	];

	return (
		<div className="flex overflow-x-auto border-b border-[#e8e1f1]" role="tablist" aria-label="กิจกรรมรอบขาย">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					id={`tab-${tab.id}`}
					type="button"
					role="tab"
					aria-selected={active === tab.id}
					aria-controls={`panel-${tab.id}`}
					onClick={() => onChange(tab.id)}
					className={`min-h-12 shrink-0 border-b-2 px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#6840c8] ${active === tab.id ? "border-[#6840c8] text-[#604594]" : "border-transparent text-[#817a8f] hover:text-[#604594]"}`}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
}

function SalesActivity({ sales }: { sales: ReportSale[] }) {
	return (
		<div id="panel-sales" role="tabpanel" aria-labelledby="tab-sales" className="overflow-x-auto">
			<table className="w-full min-w-[680px] text-left text-sm">
				<thead className="bg-[#faf9fc] text-xs text-[#70697d]"><tr><th className="px-4 py-3 font-medium">เวลา</th><th className="px-4 py-3 font-medium">สินค้า</th><th className="px-4 py-3 font-medium">ซัพพลายเออร์</th><th className="px-4 py-3 text-center font-medium">จำนวน</th><th className="px-4 py-3 font-medium">ชำระด้วย</th><th className="px-4 py-3 text-right font-medium">ยอดขาย</th></tr></thead>
				<tbody className="divide-y divide-[#f0edf4]">{sales.map((sale) => <tr key={sale.id}><td className="whitespace-nowrap px-4 py-3 text-[#817a8f]">{sale.time}</td><td className="px-4 py-3 font-medium text-[#383148]">{sale.item}</td><td className="px-4 py-3 text-[#70697d]">{sale.supplier}</td><td className="px-4 py-3 text-center text-[#514b60]">{sale.quantity}</td><td className="px-4 py-3 text-[#514b60]">{sale.channel}</td><td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[#28213a]">{currency(sale.amount)}</td></tr>)}</tbody>
			</table>
		</div>
	);
}

function ProfitStockActivity({ salesTotal, expenseTotal, netTotal }: { salesTotal: number; expenseTotal: number; netTotal: number }) {
	const supplierSales = reportSales.reduce<Record<string, number>>((totals, sale) => {
		totals[sale.supplier] = (totals[sale.supplier] ?? 0) + sale.amount;
		return totals;
	}, {});
	const supplierNames = [...new Set([
		...stockSummary.map((stock) => stock.supplier),
		...reportSales.map((sale) => sale.supplier),
	])];
	const expensePerSupplier = supplierNames.length > 0 ? Math.floor(expenseTotal / supplierNames.length) : 0;
	const expenseRemainder = supplierNames.length > 0 ? expenseTotal % supplierNames.length : 0;
	const supplierFinancials: SupplierFinancial[] = supplierNames
		.map((name, index) => {
			const sales = supplierSales[name] ?? 0;
			const expense = expensePerSupplier + (index < expenseRemainder ? 1 : 0);
			return { name, sales, expense, netAfterExpense: sales - expense };
		})
		.sort((first, second) => second.sales - first.sales);
	const supplierSalesTotal = supplierFinancials.reduce((total, supplier) => total + supplier.sales, 0);
	const supplierExpenseTotal = supplierFinancials.reduce((total, supplier) => total + supplier.expense, 0);
	const supplierNetTotal = supplierFinancials.reduce((total, supplier) => total + supplier.netAfterExpense, 0);

	return (
		<div id="panel-summary" role="tabpanel" aria-labelledby="tab-summary" className="p-4 sm:p-5">
			<div className="grid gap-3 sm:grid-cols-3">
				<SummaryMetric label="ยอดขายรวม" value={currency(salesTotal)} />
				<SummaryMetric label="ค่าใช้จ่ายรวม" value={currency(expenseTotal)} />
				<SummaryMetric label="ยอดหลังหักค่าใช้จ่าย" value={currency(netTotal)} emphasis />
			</div>
			<section aria-labelledby="supplier-financials-title" className="mt-7">
				<div className="mb-3">
					<p className="text-xs font-semibold uppercase text-[#6840c8]">ยอดขายและค่าใช้จ่าย</p>
					<h3 id="supplier-financials-title" className="mt-1 text-base font-semibold text-[#383148]">สรุปยอดแยกตามซัพพลายเออร์</h3>
				</div>
				<div className="overflow-x-auto border border-[#e9e3f2]">
					<table className="w-full min-w-[620px] text-left text-sm">
						<thead className="bg-[#faf9fc] text-xs text-[#70697d]"><tr><th className="px-4 py-3 font-medium">ซัพพลายเออร์</th><th className="px-4 py-3 text-right font-medium">ยอดขายรวม</th><th className="px-4 py-3 text-right font-medium">ส่วนแบ่งค่าใช้จ่าย</th><th className="px-4 py-3 text-right font-medium">ยอดหลังหักค่าใช้จ่าย</th></tr></thead>
						<tbody className="divide-y divide-[#f0edf4]">
							{supplierFinancials.map((supplier) => <tr key={supplier.name}><td className="px-4 py-3 font-medium text-[#383148]">{supplier.name}</td><td className="whitespace-nowrap px-4 py-3 text-right text-[#514b60]">{currency(supplier.sales)}</td><td className="whitespace-nowrap px-4 py-3 text-right text-[#70697d]">{currency(supplier.expense)}</td><td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[#167d70]">{currency(supplier.netAfterExpense)}</td></tr>)}
							<tr className="bg-[#faf9fc] font-semibold"><td className="px-4 py-3 text-[#383148]">รวม</td><td className="whitespace-nowrap px-4 py-3 text-right text-[#383148]">{currency(supplierSalesTotal)}</td><td className="whitespace-nowrap px-4 py-3 text-right text-[#514b60]">{currency(supplierExpenseTotal)}</td><td className="whitespace-nowrap px-4 py-3 text-right text-[#167d70]">{currency(supplierNetTotal)}</td></tr>
						</tbody>
					</table>
				</div>
				<p className="mt-2 text-xs leading-5 text-[#817a8f]">แบ่งค่าใช้จ่ายรวมของเจ้าของ {currency(expenseTotal)} เท่ากันตามจำนวนซัพพลายเออร์ โดยรวมซัพพลายเออร์ที่ยังไม่มียอดขาย ยอดหลังหักนี้ไม่ใช่กำไรสุทธิ เพราะยังไม่รวมต้นทุนสินค้า</p>
			</section>
			<div className="mt-6 overflow-x-auto border border-[#e9e3f2]">
				<table className="w-full min-w-[560px] text-left text-sm">
					<thead className="bg-[#faf9fc] text-xs text-[#70697d]"><tr><th className="px-4 py-3 font-medium">สินค้า</th><th className="px-4 py-3 font-medium">ซัพพลายเออร์</th><th className="px-4 py-3 text-center font-medium">รับเข้า</th><th className="px-4 py-3 text-center font-medium">ขายแล้ว</th><th className="px-4 py-3 text-center font-medium">เหลือ</th></tr></thead>
					<tbody className="divide-y divide-[#f0edf4]">{stockSummary.map((stock) => <tr key={stock.item}><td className="px-4 py-3 font-medium text-[#383148]">{stock.item}</td><td className="px-4 py-3 text-[#70697d]">{stock.supplier}</td><td className="px-4 py-3 text-center text-[#514b60]">{stock.opening}</td><td className="px-4 py-3 text-center text-[#604594]">{stock.sold}</td><td className="px-4 py-3 text-center font-semibold text-[#167d70]">{stock.remaining}</td></tr>)}</tbody>
				</table>
			</div>
		</div>
	);
}

function ExpensesActivity({ expenses, total }: { expenses: ReportExpense[]; total: number }) {
	return (
		<div id="panel-expenses" role="tabpanel" aria-labelledby="tab-expenses">
			<ul className="divide-y divide-[#f0edf4]">{expenses.map((expense) => <li key={expense.name} className="flex items-center justify-between gap-4 px-4 py-4 text-sm"><span className="text-[#514b60]">{expense.name}</span><span className="font-semibold text-[#383148]">{currency(expense.amount)}</span></li>)}</ul>
			<div className="flex items-center justify-between border-t border-[#e8e1f1] bg-[#faf9fc] px-4 py-4 text-sm font-semibold"><span className="text-[#514b60]">รวมค่าใช้จ่าย</span><span className="text-[#28213a]">{currency(total)}</span></div>
		</div>
	);
}

function SummaryMetric({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
	return <div className={`border p-4 ${emphasis ? "border-[#cfc1e7] bg-[#f8f6fb]" : "border-[#e9e3f2] bg-white"}`}><p className="text-xs text-[#70697d]">{label}</p><p className={`mt-2 text-xl font-semibold ${emphasis ? "text-[#604594]" : "text-[#28213a]"}`}>{value}</p></div>;
}

function downloadReport(run: SalesRunRecord, salesTotal: number, expenseTotal: number) {
	const rows = [
		["รอบขาย", run.name],
		["สถานะ", "เสร็จสิ้น"],
		["ยอดขายรวม", salesTotal],
		["ค่าใช้จ่ายรวม", expenseTotal],
		["ยอดสุทธิหลังหักค่าใช้จ่าย", salesTotal - expenseTotal],
		[],
		["เวลา", "สินค้า", "ซัพพลายเออร์", "จำนวน", "ช่องทางชำระ", "ยอดขาย"],
		...reportSales.map((sale) => [sale.time, sale.item, sale.supplier, sale.quantity, sale.channel, sale.amount]),
	];
	const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
	const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = `${run.name.replace(/[^\p{L}\p{N}-]+/gu, "-")}-report.csv`;
	anchor.click();
	URL.revokeObjectURL(url);
}

export default function CompleteSalesRunPage() {
	const searchParams = useSearchParams();
	const runId = searchParams.get("id") ?? "";
	const runs = useSyncExternalStore(subscribeToSalesRuns, getSalesRunsSnapshot, getServerSalesRunsSnapshot);
	const run = runs.find((item) => item.id === runId);
	const [activeView, setActiveView] = useState<ActivityView>("sales");
	const [shareMessage, setShareMessage] = useState("");

	const salesTotal = reportSales.reduce((total, sale) => total + sale.amount, 0);
	const expenseTotal = reportExpenses.reduce((total, expense) => total + expense.amount, 0);
	const netTotal = salesTotal - expenseTotal;

	async function shareReport() {
		const shareUrl = window.location.href;
		try {
			await navigator.clipboard.writeText(shareUrl);
			setShareMessage("คัดลอกลิงก์รายงานแล้ว");
		} catch {
			setShareMessage("คัดลอกไม่ได้ กรุณาคัดลอก URL จากแถบที่อยู่");
		}
	}

	if (!run) {
		return (
			<div className="flex min-h-0 flex-1 flex-col bg-[#f6f4fa] text-[#28213a]">
				<AfterLoginHeader />
				<main className="grid flex-1 place-items-center px-4 py-12">
					<section className="w-full max-w-md border border-[#e9e3f2] bg-white p-6 text-center">
						<h1 className="text-lg font-semibold text-[#383148]">ไม่พบรอบขาย</h1>
						<p className="mt-2 text-sm text-[#817a8f]">กลับไปที่รายการรอบขาย แล้วเลือกงานที่ต้องการดู</p>
						<Link href="/sales-run" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white hover:bg-[#5633ac]">กลับไปรายการรอบขาย</Link>
					</section>
				</main>
			</div>
		);
	}

	const sampleData = run.id.startsWith("mock-");

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-[#f6f4fa] text-[#28213a]">
			<AfterLoginHeader />
			<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
				<header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<div className="flex flex-wrap items-center gap-2"><p className="text-xs font-semibold uppercase text-[#6840c8]">บูทแอคทิวิตี้</p><span className="rounded-full bg-[#f1eef8] px-2.5 py-1 text-[10px] font-semibold text-[#604594]">เสร็จสิ้น</span>{sampleData && <span className="text-xs text-[#817a8f]">ข้อมูลตัวอย่าง</span>}</div>
						<h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{run.name}</h1>
						<p className="mt-2 text-sm text-[#70697d]">รายงานสรุปรอบขาย · #{run.id}</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<button type="button" onClick={() => downloadReport(run, salesTotal, expenseTotal)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white hover:bg-[#5633ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]">ดาวน์โหลดรายงาน</button>
						<button type="button" onClick={shareReport} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#d9d2e5] bg-white px-4 text-sm font-semibold text-[#604594] hover:border-[#6840c8]">แชร์ลิงก์</button>
					</div>
				</header>
				{shareMessage && <p aria-live="polite" className="mt-3 text-right text-xs text-[#167d70]">{shareMessage}</p>}
				{sampleData && <p className="mt-5 border border-[#e5deef] bg-white px-4 py-3 text-xs leading-5 text-[#70697d]">ข้อมูลกิจกรรมและรายละเอียดด้านล่างเป็นข้อมูลตัวอย่างสำหรับต้นแบบรายงาน</p>}

				<section aria-labelledby="completed-summary" className="mt-6">
					<div className="mb-3"><p className="text-xs font-semibold uppercase text-[#6840c8]">สรุปผล</p><h2 id="completed-summary" className="mt-1 text-lg font-semibold">ภาพรวมรอบขาย</h2></div>
					<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
						<SummaryMetric label="ยอดขายรวม" value={currency(salesTotal)} />
						<SummaryMetric label="ค่าใช้จ่าย" value={currency(expenseTotal)} />
						<SummaryMetric label="ยอดสุทธิ" value={currency(netTotal)} emphasis />
						<SummaryMetric label="สินค้า sold / เหลือ" value={`${stockSummary.reduce((sum, item) => sum + item.sold, 0)} / ${stockSummary.reduce((sum, item) => sum + item.remaining, 0)} ชิ้น`} />
					</div>
				</section>

				<section className="mt-7 border border-[#e9e3f2] bg-white">
					<ActivityTabs active={activeView} onChange={setActiveView} />
					{activeView === "sales" && <SalesActivity sales={reportSales} />}
					{activeView === "summary" && <ProfitStockActivity salesTotal={salesTotal} expenseTotal={expenseTotal} netTotal={netTotal} />}
					{activeView === "expenses" && <ExpensesActivity expenses={reportExpenses} total={expenseTotal} />}
				</section>
				<p className="mt-4 text-xs leading-5 text-[#817a8f]">การดาวน์โหลดจะสร้างไฟล์ CSV ลงในอุปกรณ์นี้ ส่วนลิงก์แชร์เป็นตัวอย่างและยังไม่มีระบบควบคุมสิทธิ์การเข้าถึง</p>
			</main>
		</div>
	);
}
