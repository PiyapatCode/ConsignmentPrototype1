"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import AfterLoginHeader from "../../components/layout/AfterLoginHeader";
import { getSalesRunsSnapshot, getServerSalesRunsSnapshot, subscribeToSalesRuns, type SalesRunRecord, type SalesRunStatus } from "../../lib/salesRuns";

type StatusFilter = "all" | SalesRunStatus;

function formatDate(value: string) {
	if (!value) return "ไม่ระบุวันที่";
	const date = new Date(`${value}T00:00:00`);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function formatCurrency(value: number) {
	return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(value);
}

function RunRow({ run }: { run: SalesRunRecord }) {
	return (
		<article className="grid gap-4 border-b border-[#eee9f5] px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_120px_120px_auto] sm:items-center sm:px-5">
			<div className="min-w-0">
				<div className="flex flex-wrap items-center gap-2">
					<h2 className="truncate text-sm font-semibold text-[#383148] sm:text-base">{run.name}</h2>
					{run.id.startsWith("mock-") && <span className="rounded bg-[#f8f6fb] px-2 py-1 text-[10px] font-medium text-[#817a8f]">ตัวอย่าง</span>}
					<span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${run.status === "ongoing" ? "bg-[#e6f2ec] text-[#27654f]" : "bg-[#f1eef8] text-[#604594]"}`}>
						{run.status === "ongoing" ? "กำลังดำเนินการ" : "สิ้นสุดแล้ว"}
					</span>
				</div>
				<p className="mt-1 text-xs text-[#817a8f]">สร้างเมื่อ {new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(run.createdAt))}</p>
			</div>
			<div><p className="text-[10px] font-medium text-[#817a8f] sm:hidden">วันที่จัดงาน</p><p className="mt-1 text-sm text-[#514b60]">{formatDate(run.date)}</p></div>
			<div><p className="text-[10px] font-medium text-[#817a8f] sm:hidden">สินค้า / ซัพพลายเออร์</p><p className="mt-1 text-sm text-[#514b60]">{run.productCount} สินค้า · {run.supplierCount} ราย</p></div>
			<div className="flex items-center justify-between gap-3 sm:justify-end">
				<p className="text-xs text-[#70697d]">ค่าใช้จ่าย {formatCurrency(run.expenseTotal)}</p>
				<Link href={run.status === "ended" ? `/sales-run/complete?id=${encodeURIComponent(run.id)}` : `/sales-run/onGoing/${encodeURIComponent(run.id)}`} className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-lg border border-[#d9d2e5] px-3 text-xs font-semibold text-[#604594] transition-colors hover:border-[#6840c8] hover:bg-[#f8f6fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]">{run.status === "ended" ? "ดูรายงาน" : "เปิดรอบขาย"} <span className="ml-1" aria-hidden="true">→</span></Link>
			</div>
		</article>
	);
}

export default function SalesRunListPage() {
	const runs = useSyncExternalStore(subscribeToSalesRuns, getSalesRunsSnapshot, getServerSalesRunsSnapshot);
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [search, setSearch] = useState("");
	
	const visibleRuns = runs.filter((run) => {
		const matchesStatus = statusFilter === "all" || run.status === statusFilter;
		return matchesStatus && run.name.toLocaleLowerCase("th").includes(search.trim().toLocaleLowerCase("th"));
	});

	const ongoingCount = runs.filter((run) => run.status === "ongoing").length;
	const endedCount = runs.length - ongoingCount;
	const showingMockRuns = runs.length > 0 && runs.every((run) => run.id.startsWith("mock-"));

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-[#f6f4fa] text-[#28213a]">
			<AfterLoginHeader />
			<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
				<header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
					<div>
						<p className="text-xs font-semibold uppercase text-[#6840c8]">จัดการอีเวนต์</p>
						<h1 className="mt-1 text-3xl font-semibold text-[#28213a]">รอบขายของฉัน</h1>
						<p className="mt-2 text-sm text-[#70697d]">ดูและจัดการรอบขายที่คุณสร้างไว้</p>
					</div>
					<Link href="/sales-run/create" className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#5633ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8] sm:self-auto"><span aria-hidden="true">+</span> สร้างรอบขาย</Link>
				</header>

				<div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-lg">
					<div className="border border-[#e9e3f2] bg-white p-4"><p className="text-xs text-[#817a8f]">รอบขายทั้งหมด</p><p className="mt-1 text-2xl font-semibold text-[#28213a]">{runs.length}</p></div>
					<div className="border border-[#e9e3f2] bg-white p-4"><p className="text-xs text-[#817a8f]">กำลังดำเนินการ</p><p className="mt-1 text-2xl font-semibold text-[#27654f]">{ongoingCount}</p><span className="sr-only">สิ้นสุดแล้ว {endedCount} รอบ</span></div>
				</div>
				{showingMockRuns && <p className="mt-4 border border-[#e5deef] bg-white px-4 py-3 text-xs leading-5 text-[#70697d]">กำลังแสดงข้อมูลตัวอย่างเพื่อให้เห็นรูปแบบรายการ เมื่อสร้างรอบขายจริง ข้อมูลตัวอย่างจะถูกแทนที่</p>}

				<section className="mt-6 border border-[#e9e3f2] bg-white" aria-label="รายการรอบขาย">
					<div className="flex flex-col gap-3 border-b border-[#ebe6f3] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
						<div className="flex flex-wrap gap-1" role="group" aria-label="กรองสถานะรอบขาย">
							{(["all", "ongoing", "ended"] as const).map((filter) => {
								const label = filter === "all" ? `ทั้งหมด (${runs.length})` : filter === "ongoing" ? `กำลังดำเนินการ (${ongoingCount})` : `สิ้นสุดแล้ว (${endedCount})`;
								return <button key={filter} type="button" aria-pressed={statusFilter === filter} onClick={() => setStatusFilter(filter)} className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${statusFilter === filter ? "bg-[#f1eef8] text-[#604594]" : "text-[#70697d] hover:bg-[#faf9fc]"}`}>{label}</button>;
							})}
						</div>
						<label className="relative block w-full sm:max-w-xs"><span className="sr-only">ค้นหารอบขาย</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาชื่อรอบขาย" className="min-h-10 w-full rounded-lg border border-[#d9d2e5] bg-white px-3 text-sm text-[#28213a] outline-none placeholder:text-[#a29bad] focus:border-[#6840c8] focus:ring-3 focus:ring-[#6840c8]/15" /></label>
					</div>

					{visibleRuns.length > 0 ? (
						<div>
							<div className="hidden grid-cols-[minmax(0,1fr)_120px_120px_auto] gap-4 bg-[#faf9fc] px-5 py-2.5 text-[10px] font-semibold uppercase text-[#817a8f] sm:grid"><span>ชื่อรอบขาย</span><span>วันที่จัดงาน</span><span>สินค้า / ซัพพลายเออร์</span><span className="text-right">การจัดการ</span></div>
							{visibleRuns.map((run) => <RunRow key={run.id} run={run} />)}
						</div>
					) : (
						<div className="px-5 py-14 text-center">
							<span className="mx-auto grid size-11 place-items-center rounded-full bg-[#f1eef8] text-xl text-[#6840c8]" aria-hidden="true">▦</span>
							<h2 className="mt-4 text-base font-semibold text-[#383148]">{runs.length === 0 ? "ยังไม่มีรอบขาย" : "ไม่พบรอบขายที่ค้นหา"}</h2>
							<p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#817a8f]">{runs.length === 0 ? "สร้างรอบขายแรกของคุณ แล้วจะปรากฏในรายการนี้" : "ลองใช้คำค้นอื่นหรือเลือกดูทุกสถานะ"}</p>
							{runs.length === 0 && <Link href="/sales-run/create" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white hover:bg-[#5633ac]">สร้างรอบขาย</Link>}
						</div>
					)}
				</section>
				<p className="mt-4 text-xs text-[#817a8f]">{showingMockRuns ? "ข้อมูลตัวอย่าง ไม่ได้บันทึกเป็นรอบขายจริง" : "รายการเก็บไว้ในเบราว์เซอร์เครื่องนี้เท่านั้น ยังไม่ได้ซิงก์กับบัญชีหรือเซิร์ฟเวอร์"}</p>
			</main>
		</div>
	);
}
