"use client";

import { useState, type FormEvent, useSyncExternalStore } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getSalesRunsSnapshot, getServerSalesRunsSnapshot, subscribeToSalesRuns } from "../../../../lib/salesRuns";
import { addPendingStaffInvite, recognizeDemoStaffMember } from "../../../../lib/staffInvites";

const inputClass = "min-h-12 w-full rounded-xl border border-[#ddd6e9] bg-white px-4 text-sm text-[#28213a] outline-none placeholder:text-[#aaa4b4] focus:border-[#6840c8] focus:ring-3 focus:ring-[#6840c8]/15";
const demoMemberUsernames = ["nicha", "ploy", "ton"];

export default function RunInvitePage() {
	const { id: runId } = useParams<{ id: string }>();
	const router = useRouter();
	const runs = useSyncExternalStore(subscribeToSalesRuns, getSalesRunsSnapshot, getServerSalesRunsSnapshot);
	const run = runs.find((item) => item.id === runId);
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");

	function acceptInvite(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const demoMember = recognizeDemoStaffMember(runId, name.trim(), username.trim());
		if (demoMember) {
			navigateByRole(demoMember.id, demoMember.role);
			return;
		}
		if (demoMemberUsernames.includes(username.trim().toLocaleLowerCase("en-US"))) {
			setError("ชื่อผู้ใช้และชื่อที่แสดงไม่ตรงกับสมาชิกเดิม กรุณาตรวจสอบข้อมูล");
			return;
		}
		const result = addPendingStaffInvite(runId, name.trim(), username.trim());
		if (!result.ok && result.reason === "duplicate") {
			setError("ชื่อผู้ใช้นี้อยู่ในรายชื่อรออนุมัติหรือเป็นสมาชิกของรอบขายแล้ว");
			return;
		}
		if (!result.ok) {
			setError("บันทึกคำขอไม่สำเร็จ กรุณาลองอีกครั้ง");
			return;
		}
		navigateByRole(result.invite.id, result.invite.role);
	}

	function navigateByRole(inviteId: string, role: string) {
		const query = `?invite=${encodeURIComponent(inviteId)}`;
		if (role === "ผู้จัดการ" || role === "พนักงานขาย") {
			router.push(`/sales-run/onGoing/${encodeURIComponent(runId)}${query}`);
			return;
		}
		router.push(`/sales-run/view-status/${encodeURIComponent(runId)}${query}`);
	}

	if (!run) {
		return (
			<main className="grid min-h-0 flex-1 place-items-center bg-[#f6f4fa] px-4 py-12 text-[#28213a]">
				<section className="w-full max-w-md border border-[#e9e3f2] bg-white p-6 text-center">
					<h1 className="text-lg font-semibold">ไม่พบลิงก์เชิญนี้</h1>
					<p className="mt-2 text-sm text-[#817a8f]">ตรวจสอบลิงก์กับเจ้าของรอบขายอีกครั้ง</p>
					<Link href="/sales-run" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white">กลับหน้าหลัก</Link>
				</section>
			</main>
		);
	}

	return (
		<main className="relative grid min-h-0 flex-1 place-items-center overflow-hidden bg-[#f6f4fa] px-4 py-8 text-[#28213a] sm:px-6 sm:py-12">
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_#e9e1f8_0%,_transparent_50%)]" />
			<section className="relative w-full max-w-md border border-[#e9e3f2] bg-white p-6 shadow-[0_18px_60px_-42px_rgba(45,32,72,0.35)] sm:p-8">
				<p className="text-xs font-semibold uppercase text-[#6840c8]">คำเชิญเข้าร่วมรอบขาย</p>
				<h1 className="mt-2 text-2xl font-semibold text-[#28213a]">ยืนยันชื่อของคุณ</h1>
				<p className="mt-3 text-sm leading-6 text-[#70697d]">คุณได้รับเชิญให้ดูสถานะสต็อกของ <span className="font-semibold text-[#383148]">{run.name}</span> กดยืนยันแล้วระบบจะพาไปหน้าดูข้อมูลก่อน โดยยังไม่มีสิทธิ์แก้ไขหรือจัดการรอบขาย</p>
				<form onSubmit={acceptInvite} className="mt-6 space-y-4">
					<div><label htmlFor="invite-username" className="mb-1.5 block text-sm font-medium text-[#393249]">ชื่อผู้ใช้</label><input id="invite-username" className={inputClass} value={username} onChange={(event) => setUsername(event.target.value)} placeholder="เช่น artist_nicha" autoComplete="username" maxLength={40} required /></div>
					<div><label htmlFor="invite-name" className="mb-1.5 block text-sm font-medium text-[#393249]">ชื่อที่ใช้แสดง</label><input id="invite-name" className={inputClass} value={name} onChange={(event) => setName(event.target.value)} placeholder="กรอกชื่อของคุณ" autoComplete="name" maxLength={80} required /></div>
					{error && <p role="alert" className="text-sm text-[#a3412d]">{error}</p>}
					<button type="submit" disabled={!name.trim() || !username.trim()} className="min-h-12 w-full rounded-xl bg-[#6840c8] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5633ac] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]">ยืนยันและดูสถานะสต็อก</button>
				</form>
				<p className="mt-5 border-t border-[#eee9f5] pt-4 text-xs leading-5 text-[#817a8f]">หลังยืนยัน คุณจะเข้าได้เฉพาะหน้าสถานะสต็อกจนกว่าเจ้าของรอบขายจะกำหนดสิทธิ์ให้ ขณะนี้ลิงก์เป็นต้นแบบและเก็บข้อมูลไว้ในเบราว์เซอร์</p>
			</section>
		</main>
	);
}
