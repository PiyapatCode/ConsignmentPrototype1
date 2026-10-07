"use client";

import { useEffect, useState, type FormEvent, useSyncExternalStore } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AfterLoginHeader from "../../../../components/layout/AfterLoginHeader";
import { getSalesRunsSnapshot, getServerSalesRunsSnapshot, subscribeToSalesRuns, updateSalesRunStatus } from "../../../../lib/salesRuns";
import { getStaffInvitesSnapshot, getServerStaffInvitesSnapshot, subscribeToStaffInvites, updateStaffInviteRole, updateStaffInviteEndPermission, type StaffInvite, type StaffRole } from "../../../../lib/staffInvites";

type Product = { id: string; name: string; price: number; stock: number; sold: number; supplier: string };
type Sale = { id: string; product: string; quantity: number; amount: number; channel: string; time: string };
type SupplierProduct = { name: string; price: number };
type Supplier = { id: string; name: string; contact: string; products: SupplierProduct[] };
type Staff = { id: string; name: string; email: string; role: "ผู้จัดการ" | "พนักงานขาย" | "ดูข้อมูล" };
type Expense = { id: string; name: string; amount: number };
type View = "overview" | "board" | "sales" | "stock" | "suppliers" | "expenses" | "staff" | "activity";

const navItems: { id: View; label: string; mark: string }[] = [
	{ id: "overview", label: "ข้อมูลรอบขาย", mark: "◫" },
	{ id: "board", label: "กระดานขาย", mark: "▦" },
	{ id: "sales", label: "ประวัติการขาย", mark: "↗" },
	{ id: "stock", label: "จัดการสต็อก", mark: "▤" },
	{ id: "suppliers", label: "ซัพพลายเออร์", mark: "♧" },
	{ id: "expenses", label: "ค่าใช้จ่าย", mark: "−" },
	{ id: "staff", label: "ทีมงานและสิทธิ์", mark: "♙" },
	{ id: "activity", label: "ประวัติแก้ไข", mark: "◷" },
];

const initialProducts: Product[] = [
	{ id: "p1", name: "โปสการ์ดสวนดอกไม้", price: 120, stock: 24, sold: 6, supplier: "Mali Studio" },
	{ id: "p2", name: "สติกเกอร์ชุดแมว", price: 85, stock: 31, sold: 9, supplier: "Mali Studio" },
	{ id: "p3", name: "พวงกุญแจอะคริลิก", price: 180, stock: 12, sold: 4, supplier: "Northstar Art" },
	{ id: "p4", name: "สมุดภาพเล่มเล็ก", price: 250, stock: 8, sold: 2, supplier: "จัดการโดยบูท" },
];

const initialSales: Sale[] = [
	{ id: "s1", product: "โปสการ์ดสวนดอกไม้", quantity: 2, amount: 240, channel: "QR", time: "14:32" },
	{ id: "s2", product: "สติกเกอร์ชุดแมว", quantity: 1, amount: 85, channel: "เงินสด", time: "14:18" },
	{ id: "s3", product: "พวงกุญแจอะคริลิก", quantity: 1, amount: 180, channel: "QR", time: "13:56" },
	{ id: "s4", product: "สมุดภาพเล่มเล็ก", quantity: 1, amount: 250, channel: "เงินสด", time: "13:41" },
];

const initialSuppliers: Supplier[] = [
	{ id: "u1", name: "Mali Studio", contact: "mali@example.com", products: [{ name: "โปสการ์ดสวนดอกไม้", price: 120 }, { name: "สติกเกอร์ชุดแมว", price: 85 }] },
	{ id: "u2", name: "Northstar Art", contact: "northstar@example.com", products: [{ name: "พวงกุญแจอะคริลิก", price: 180 }] },
	{ id: "booth", name: "จัดการโดยบูท", contact: "สินค้าของเจ้าของรอบขาย", products: [{ name: "สมุดภาพเล่มเล็ก", price: 250 }] },
];

const inputClass = "min-h-10 w-full rounded-lg border border-[#d9d2e5] bg-white px-3 py-2 text-sm text-[#28213a] outline-none placeholder:text-[#a29bad] focus:border-[#6840c8] focus:ring-3 focus:ring-[#6840c8]/15";

function makeId() {
	return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function money(value: number) {
	return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(value);
}

function PanelTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
	return (
		<div className="mb-6 flex flex-wrap items-end justify-between gap-4">
			<div>
				<p className="text-xs font-semibold uppercase text-[#6840c8]">{eyebrow}</p>
				<h2 className="mt-1 text-xl font-semibold text-[#28213a] sm:text-2xl">{title}</h2>
				<p className="mt-2 text-sm leading-6 text-[#70697d]">{description}</p>
			</div>
			{action}
		</div>
	);
}

function Stat({ label, value, note, tone = "purple" }: { label: string; value: string; note: string; tone?: "purple" | "green" }) {
	return (
		<div className="border border-[#e9e3f2] bg-white p-4 sm:p-5">
			<p className="text-xs font-medium text-[#70697d]">{label}</p>
			<p className="mt-2 text-2xl font-semibold text-[#28213a]">{value}</p>
			<p className={`mt-1 text-xs ${tone === "green" ? "text-[#167d70]" : "text-[#817a8f]"}`}>{note}</p>
		</div>
	);
}

function SalesBoard({ products, onSell, ended }: { products: Product[]; onSell: (product: Product, quantity: number, amount: number, channel: string) => void; ended: boolean }) {
	return (
		<section aria-label="กระดานขาย">
			<PanelTitle eyebrow="หน้าขาย" title="กระดานขาย" description="กำหนดจำนวน ช่องทางชำระ และยอดรับของแต่ละรายการก่อนบันทึกขาย" />
			{ended && <p className="mb-4 border border-[#e9d5dd] bg-[#fbf5f7] p-3 text-sm text-[#7b5365]">รอบขายนี้สิ้นสุดแล้ว จึงไม่สามารถบันทึกยอดขายใหม่ได้</p>}
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
				{products.map((product) => <ProductSaleCard key={product.id} product={product} onSell={onSell} ended={ended} />)}
			</div>
		</section>
	);
}

function ProductSaleCard({ product, onSell, ended }: { product: Product; onSell: (product: Product, quantity: number, amount: number, channel: string) => void; ended: boolean }) {
	const [quantity, setQuantity] = useState(1);
	const [amount, setAmount] = useState(product.price);
	const [channel, setChannel] = useState("QR");

	function changeQuantity(value: number) {
		const nextQuantity = Math.min(Math.max(1, value), Math.max(1, product.stock));
		setQuantity(nextQuantity);
		setAmount(product.price * nextQuantity);
	}

	return (
		<article className="flex flex-col border border-[#e9e3f2] bg-white p-4">
			<div className="flex items-start justify-between gap-3">
				<div><h3 className="font-semibold text-[#383148]">{product.name}</h3><p className="mt-2 text-sm text-[#817a8f]">{product.supplier} · {money(product.price)} / ชิ้น</p></div>
				<span className="shrink-0 bg-[#f1eef8] px-2 py-1 text-[10px] font-medium text-[#604594]">เหลือ {product.stock}</span>
			</div>
			<form className="mt-4 space-y-3" onSubmit={(event) => { event.preventDefault(); onSell(product, quantity, amount, channel); setQuantity(1); setAmount(product.price); setChannel("QR"); }}>
				<label className="block text-xs font-medium text-[#625c70]">จำนวน
					<input className={`${inputClass} mt-1`} type="number" min="1" max={product.stock} value={quantity} onChange={(event) => changeQuantity(Number(event.target.value))} disabled={ended || product.stock < 1} required />
				</label>
				<label className="block text-xs font-medium text-[#625c70]">ช่องทางชำระ
					<select className={`${inputClass} mt-1`} value={channel} onChange={(event) => setChannel(event.target.value)} disabled={ended}>
						<option value="QR">QR</option><option value="เงินสด">เงินสด</option><option value="บัตร">บัตร</option><option value="โอนเงิน">โอนเงิน</option>
					</select>
				</label>
				<label className="block text-xs font-medium text-[#625c70]">ยอดรับจริง (บาท)
					<input className={`${inputClass} mt-1`} type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(Number(event.target.value))} disabled={ended} required />
				</label>
				<button type="submit" disabled={ended || product.stock < 1 || quantity > product.stock || amount < 0} className="min-h-10 w-full rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#5633ac] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]">บันทึกการขาย · {money(amount)}</button>
			</form>
		</article>
	);
}

function SalesLog({ sales }: { sales: Sale[] }) {
	return (
		<section aria-label="ประวัติการขาย">
			<PanelTitle eyebrow="รายการธุรกรรม" title="ประวัติการขาย" description="ตรวจสอบสินค้า จำนวนเงิน ช่องทางชำระ และเวลาที่บันทึก" />
			<div className="overflow-x-auto border border-[#e9e3f2] bg-white">
				<table className="w-full min-w-[620px] text-left text-sm">
					<thead className="bg-[#faf9fc] text-xs text-[#70697d]"><tr><th className="px-4 py-3 font-medium">เวลา</th><th className="px-4 py-3 font-medium">สินค้า</th><th className="px-4 py-3 font-medium">จำนวน</th><th className="px-4 py-3 font-medium">ชำระด้วย</th><th className="px-4 py-3 text-right font-medium">ยอดรวม</th></tr></thead>
					<tbody className="divide-y divide-[#f0edf4]">
						{sales.map((sale) => <tr key={sale.id}><td className="whitespace-nowrap px-4 py-3 text-[#817a8f]">{sale.time}</td><td className="px-4 py-3 font-medium text-[#383148]">{sale.product}</td><td className="px-4 py-3 text-[#625c70]">{sale.quantity}</td><td className="px-4 py-3"><span className="rounded-full bg-[#f1eef8] px-2.5 py-1 text-xs text-[#604594]">{sale.channel}</span></td><td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[#28213a]">{money(sale.amount)}</td></tr>)}
						{sales.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-[#817a8f]">ยังไม่มีรายการขาย</td></tr>}
					</tbody>
				</table>
			</div>
		</section>
	);
}

function StockPanel({ suppliers, products, onAdd, onAdjust }: { suppliers: Supplier[]; products: Product[]; onAdd: (product: Product) => void; onAdjust: (id: string, amount: number) => void }) {
	const [showForm, setShowForm] = useState(false);
	const [supplierId, setSupplierId] = useState("");
	const [productName, setProductName] = useState("");
	const [stock, setStock] = useState("");
	const [stockToAdd, setStockToAdd] = useState<Record<string, string>>({});
	const selectedSupplier = suppliers.find((supplier) => supplier.id === supplierId);
	const selectedItem = selectedSupplier?.products.find((product) => product.name === productName);
	const selectedItemAlreadyStocked = Boolean(selectedSupplier && selectedItem && products.some((product) => product.supplier === selectedSupplier.name && product.name === selectedItem.name));

	function addProduct(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!selectedSupplier || !selectedItem || selectedItemAlreadyStocked) return;
		onAdd({ id: makeId(), name: selectedItem.name, price: selectedItem.price, stock: Number(stock), sold: 0, supplier: selectedSupplier.name });
		setSupplierId(""); setProductName(""); setStock(""); setShowForm(false);
	}

	return (
		<section aria-label="จัดการสต็อก">
			<PanelTitle eyebrow="คลังสินค้า" title="จัดการสต็อก" description="ตรวจจำนวนคงเหลือ ปรับสต็อก หรือเพิ่มสินค้าในรอบขาย" action={<button type="button" onClick={() => setShowForm((shown) => !shown)} className="min-h-10 rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white hover:bg-[#5633ac]">{showForm ? "ยกเลิก" : "+ เพิ่มสินค้า"}</button>} />
			{showForm && (
				<form onSubmit={addProduct} className="mb-5 space-y-4 border border-[#e9e3f2] bg-[#faf9fc] p-4">
					<div className="grid gap-3 sm:grid-cols-[1fr_1.3fr_0.7fr_auto] sm:items-end">
						<label className="space-y-1 text-xs font-medium text-[#514b60]">ซัพพลายเออร์
							<select className={inputClass} value={supplierId} onChange={(event) => { setSupplierId(event.target.value); setProductName(""); }} required>
								<option value="">เลือกซัพพลายเออร์</option>
								{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name} ({supplier.products.length} รายการ)</option>)}
							</select>
						</label>
						<label className="space-y-1 text-xs font-medium text-[#514b60]">สินค้า
							<select className={inputClass} value={productName} onChange={(event) => setProductName(event.target.value)} disabled={!selectedSupplier || selectedSupplier.products.length === 0} required>
								<option value="">{!selectedSupplier ? "เลือกซัพพลายเออร์ก่อน" : selectedSupplier.products.length === 0 ? "ซัพพลายเออร์นี้ยังไม่มีสินค้า" : "เลือกสินค้า"}</option>
								{selectedSupplier?.products.map((item) => {
									const isStocked = products.some((product) => product.supplier === selectedSupplier.name && product.name === item.name);
									return <option key={item.name} value={item.name} disabled={isStocked}>{item.name} · {money(item.price)}{isStocked ? " · อยู่ในสต็อกแล้ว" : ""}</option>;
								})}
							</select>
						</label>
						<label className="space-y-1 text-xs font-medium text-[#514b60]">จำนวนเริ่มต้น<input className={inputClass} type="number" min="0" step="1" value={stock} onChange={(event) => setStock(event.target.value)} required /></label>
						<button type="submit" disabled={!selectedItem || selectedItemAlreadyStocked} className="min-h-10 rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">เพิ่มเข้าสต็อก</button>
					</div>
					{selectedSupplier && <div className="border-t border-[#e5deef] pt-3"><p className="mb-2 text-xs font-semibold text-[#70697d]">รายการสินค้าของ {selectedSupplier.name}</p>{selectedSupplier.products.length ? <ul className="flex flex-wrap gap-2">{selectedSupplier.products.map((item) => { const isStocked = products.some((product) => product.supplier === selectedSupplier.name && product.name === item.name); return <li key={item.name} className={`px-3 py-1.5 text-xs ${isStocked ? "bg-[#f0edf4] text-[#817a8f]" : "bg-[#eee9f8] text-[#604594]"}`}>{item.name} · {money(item.price)}{isStocked ? " · อยู่ในสต็อกแล้ว" : ""}</li>; })}</ul> : <p className="text-xs text-[#817a8f]">เพิ่มสินค้าและราคาที่แค็ตตาล็อกซัพพลายเออร์ก่อน</p>}</div>}
				</form>
			)}
			<div className="overflow-x-auto border border-[#e9e3f2] bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#faf9fc] text-xs text-[#70697d]"><tr><th className="px-4 py-3 font-medium">สินค้า</th><th className="px-4 py-3 font-medium">ซัพพลายเออร์ / เจ้าของ</th><th className="px-4 py-3 text-right font-medium">ราคา</th><th className="px-4 py-3 text-center font-medium">คงเหลือ</th><th className="px-4 py-3 font-medium">เพิ่มจำนวน</th></tr></thead><tbody className="divide-y divide-[#f0edf4]">{products.map((product) => <tr key={product.id}><td className="px-4 py-3 font-medium text-[#383148]">{product.name}</td><td className="px-4 py-3 text-[#70697d]">{product.supplier}</td><td className="px-4 py-3 text-right text-[#514b60]">{money(product.price)}</td><td className="px-4 py-3 text-center font-semibold text-[#28213a]">{product.stock}</td><td className="px-4 py-3"><form className="flex items-center gap-2" onSubmit={(event) => { event.preventDefault(); const amount = Number(stockToAdd[product.id]); if (!Number.isInteger(amount) || amount < 1) return; onAdjust(product.id, amount); setStockToAdd((current) => ({ ...current, [product.id]: "" })); }}><input aria-label={`จำนวนสต็อกที่เพิ่มให้ ${product.name}`} className={`${inputClass} min-h-9 w-24`} type="number" min="1" step="1" value={stockToAdd[product.id] ?? ""} onChange={(event) => setStockToAdd((current) => ({ ...current, [product.id]: event.target.value }))} placeholder="จำนวน" required /><button type="submit" className="min-h-9 rounded-md bg-[#eee9f8] px-3 text-xs font-semibold text-[#604594] hover:bg-[#e4dcf2]">+</button><button type="button" aria-label={`ลดสต็อก ${product.name} หนึ่งชิ้น`} onClick={() => onAdjust(product.id, -1)} className="size-9 border border-[#d9d2e5] text-[#514b60] hover:bg-[#f7f5fa]">−</button></form></td></tr>)}</tbody></table></div>
		</section>
	);
}

function SuppliersPanel({ suppliers, onAdd, onRename, onAddProduct, onUpdateProduct, onDeleteProduct }: { suppliers: Supplier[]; onAdd: (supplier: Supplier) => void; onRename: (id: string, name: string, contact: string) => void; onAddProduct: (id: string, product: SupplierProduct) => void; onUpdateProduct: (supplierId: string, previousName: string, product: SupplierProduct) => void; onDeleteProduct: (supplierId: string, productName: string) => void }) {
	const [showForm, setShowForm] = useState(false);
	const [name, setName] = useState("");
	const [contact, setContact] = useState("");
	const [editing, setEditing] = useState<string | null>(null);
	const [productInput, setProductInput] = useState<Record<string, string>>({});
	const [productPrice, setProductPrice] = useState<Record<string, string>>({});

	function addSupplier(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onAdd({ id: makeId(), name: name.trim(), contact: contact.trim() || "ไม่ระบุช่องทางติดต่อ", products: [] });
		setName("");
		setContact("");
		setShowForm(false);
	}

	return (
		<section aria-label="จัดการซัพพลายเออร์">
			<PanelTitle eyebrow="เครือข่ายผู้ฝากขาย" title="จัดการซัพพลายเออร์" description="ดูแลข้อมูลผู้ฝากขายและแค็ตตาล็อกสินค้า รวมถึงราคาที่ใช้กับสต็อก" action={<button type="button" onClick={() => setShowForm((shown) => !shown)} className="min-h-10 rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white hover:bg-[#5633ac]">{showForm ? "ยกเลิก" : "+ เพิ่มซัพพลายเออร์"}</button>} />
			{showForm && <form onSubmit={addSupplier} className="mb-5 grid gap-3 border border-[#e9e3f2] bg-[#faf9fc] p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><label className="space-y-1 text-xs font-medium text-[#514b60]">ชื่อซัพพลายเออร์<input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} required /></label><label className="space-y-1 text-xs font-medium text-[#514b60]">อีเมลหรือช่องทางติดต่อ<input className={inputClass} value={contact} onChange={(event) => setContact(event.target.value)} /></label><button className="min-h-10 rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white">เพิ่มรายชื่อ</button></form>}
			<div className="space-y-3">
				{suppliers.map((supplier) => (
					<article key={supplier.id} className="border border-[#e9e3f2] bg-white">
						<div className="flex flex-wrap items-start justify-between gap-3 p-4"><div><h3 className="font-semibold text-[#383148]">{supplier.name}</h3><p className="mt-1 text-sm text-[#817a8f]">{supplier.contact} · {supplier.products.length} รายการสินค้า</p></div><button type="button" onClick={() => setEditing(editing === supplier.id ? null : supplier.id)} className="rounded-md px-3 py-2 text-xs font-semibold text-[#6840c8] hover:bg-[#f8f6fb]">{editing === supplier.id ? "ปิดการจัดการ" : "แก้ไขข้อมูล / สินค้า"}</button></div>
						{editing === supplier.id && <div className="space-y-4 border-t border-[#eee9f5] bg-[#faf9fc] p-4">
							<form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); onRename(supplier.id, String(form.get("supplierName") ?? "").trim(), String(form.get("supplierContact") ?? "").trim()); }}><input name="supplierName" className={inputClass} defaultValue={supplier.name} aria-label="ชื่อซัพพลายเออร์" required /><input name="supplierContact" className={inputClass} defaultValue={supplier.contact} aria-label="ช่องทางติดต่อ" /><button className="min-h-10 rounded-lg border border-[#d9d2e5] px-3 text-sm font-semibold text-[#514b60] hover:bg-white">บันทึกข้อมูล</button></form>
							<form className="grid gap-2 sm:grid-cols-[1.3fr_0.8fr_auto] sm:items-end" onSubmit={(event) => { event.preventDefault(); const value = productInput[supplier.id]?.trim(); const price = Number(productPrice[supplier.id]); if (!value || !Number.isFinite(price) || price < 0 || supplier.products.some((product) => product.name === value)) return; onAddProduct(supplier.id, { name: value, price }); setProductInput((current) => ({ ...current, [supplier.id]: "" })); setProductPrice((current) => ({ ...current, [supplier.id]: "" })); }}><label className="space-y-1 text-xs font-medium text-[#514b60]">ชื่อสินค้า<input className={inputClass} value={productInput[supplier.id] ?? ""} onChange={(event) => setProductInput((current) => ({ ...current, [supplier.id]: event.target.value }))} placeholder="ชื่อสินค้า" required /></label><label className="space-y-1 text-xs font-medium text-[#514b60]">ราคาต่อชิ้น<input className={inputClass} type="number" min="0" step="0.01" value={productPrice[supplier.id] ?? ""} onChange={(event) => setProductPrice((current) => ({ ...current, [supplier.id]: event.target.value }))} placeholder="0.00" required /></label><button className="min-h-10 rounded-lg bg-[#eee9f8] px-4 text-sm font-semibold text-[#604594]">เพิ่มสินค้า</button></form>
							{supplier.products.length > 0 && <div className="space-y-2"><p className="text-xs font-semibold text-[#70697d]">สินค้าและราคา</p>{supplier.products.map((product) => <form key={product.name} className="grid gap-2 rounded-md border border-[#e9e3f2] bg-white p-3 sm:grid-cols-[1.3fr_0.8fr_auto_auto] sm:items-end" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const nextName = String(form.get("productName") ?? "").trim(); const nextPrice = Number(form.get("productPrice"));
								if (!nextName || !Number.isFinite(nextPrice) || nextPrice < 0) return;
								onUpdateProduct(supplier.id, product.name, { name: nextName, price: nextPrice });
							}}><label className="space-y-1 text-xs font-medium text-[#514b60]">ชื่อสินค้า<input name="productName" className={inputClass} defaultValue={product.name} aria-label={`ชื่อสินค้า ${product.name}`} required /></label><label className="space-y-1 text-xs font-medium text-[#514b60]">ราคาต่อชิ้น<input name="productPrice" className={inputClass} type="number" min="0" step="0.01" defaultValue={product.price} aria-label={`ราคาสินค้า ${product.name}`} required /></label><button className="min-h-10 rounded-lg border border-[#d9d2e5] px-3 text-xs font-semibold text-[#514b60] hover:border-[#6840c8]">บันทึก</button><button type="button" onClick={() => onDeleteProduct(supplier.id, product.name)} className="min-h-10 rounded-lg px-3 text-xs font-semibold text-[#a3412d] hover:bg-[#fbf1ed]">ลบ</button></form>)}</div>}
						</div>}
					</article>
				))}
			</div>
		</section>
	);
}

function ExpensesPanel({ expenses, onAdd, onRemove }: { expenses: Expense[]; onAdd: (expense: Expense) => void; onRemove: (id: string) => void }) {
	const [name, setName] = useState("");
	const [amount, setAmount] = useState("");
	function addExpense(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onAdd({ id: makeId(), name: name.trim(), amount: Number(amount) }); setName(""); setAmount("");
	}
	return (
		<section aria-label="จัดการค่าใช้จ่าย">
			<PanelTitle eyebrow="ค่าใช้จ่ายอีเวนต์" title="รายการค่าใช้จ่าย" description="ติดตามค่าใช้จ่ายของรอบขายเพื่อใช้ประกอบการสรุปยอด" />
			<form onSubmit={addExpense} className="mb-5 grid gap-3 rounded-lg border border-[#e9e3f2] bg-white p-4 sm:grid-cols-[1.4fr_1fr_auto] sm:items-end"><label className="space-y-1 text-xs font-medium text-[#514b60]">รายการ<input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} placeholder="เช่น ค่าเช่าพื้นที่" required /></label><label className="space-y-1 text-xs font-medium text-[#514b60]">จำนวนเงิน<input className={inputClass} type="number" min="0" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" required /></label><button className="min-h-10 rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white hover:bg-[#5633ac]">เพิ่มค่าใช้จ่าย</button></form>
			<div className="divide-y divide-[#f0edf4] border border-[#e9e3f2] bg-white">{expenses.map((expense) => <div key={expense.id} className="flex items-center justify-between gap-3 px-4 py-3"><span className="text-sm text-[#514b60]">{expense.name}</span><div className="flex items-center gap-4"><span className="text-sm font-semibold text-[#383148]">{money(expense.amount)}</span><button type="button" onClick={() => onRemove(expense.id)} className="text-xs text-[#817a8f] hover:text-[#6840c8]">ลบ</button></div></div>)}</div>
		</section>
	);
}

function StaffPanel({ staff, invites, onChangeRole, onGrantInviteRole, shareLink, onGenerateShareLink, ownerView }: { staff: Staff[]; invites: StaffInvite[]; onChangeRole: (id: string, role: Staff["role"]) => void; onGrantInviteRole: (id: string, role: Exclude<StaffRole, "pending">) => void; shareLink: string; onGenerateShareLink: () => void; ownerView: boolean }) {
	const [copyMessage, setCopyMessage] = useState("");
	const pendingInvites = invites.filter((invite) => invite.role === "pending");
	const approvedInvites = invites.filter((invite) => invite.role !== "pending");

	async function copyShareLink() {
		try {
			await navigator.clipboard.writeText(shareLink);
			setCopyMessage("คัดลอกลิงก์แล้ว");
		} catch {
			setCopyMessage("คัดลอกไม่ได้ กรุณาเลือกลิงก์แล้วคัดลอกเอง");
		}
	}

	return (
		<section aria-label="จัดการทีมงานและสิทธิ์">
			<PanelTitle eyebrow="จัดการทีม" title="ทีมงานและสิทธิ์" description={ownerView ? "ผู้รับลิงก์เข้าดูสต็อกก่อน คุณเป็นผู้กำหนดสิทธิ์ทีมและสิทธิ์จบรอบ" : "ดูรายชื่อทีมและบทบาทในรอบขายนี้"} action={ownerView ? <button type="button" onClick={onGenerateShareLink} className="min-h-10 rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white hover:bg-[#5633ac]">สร้างลิงก์เชิญ</button> : undefined} />
			{ownerView && shareLink && <div className="mb-5 border border-[#d8ccef] bg-[#f8f6fb] p-4"><label htmlFor="stock-share-link" className="text-xs font-semibold text-[#604594]">ลิงก์เชิญ · ยืนยันชื่อก่อนดูสต็อก</label><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input id="stock-share-link" readOnly value={shareLink} onFocus={(event) => event.currentTarget.select()} className={`${inputClass} min-w-0 flex-1`} /><button type="button" onClick={copyShareLink} className="min-h-10 shrink-0 rounded-lg border border-[#d9d2e5] bg-white px-4 text-sm font-semibold text-[#604594] hover:bg-[#f1eef8]">คัดลอกลิงก์</button></div><p aria-live="polite" className="mt-2 min-h-4 text-xs text-[#167d70]">{copyMessage}</p><p className="text-xs leading-5 text-[#817a8f]">ผู้รับจะเข้าหน้าดูสต็อกแบบอ่านอย่างเดียว และต้องรอคุณกำหนดสิทธิ์ทีม · ต้นแบบนี้ยังไม่มีระบบยืนยันตัวตนจริง</p></div>}
			{ownerView && <section aria-label="คำขอเข้าร่วม" className="mb-6">
				<div className="mb-3 flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-[#383148]">รออนุมัติ</h3><span className="text-xs text-[#817a8f]">{pendingInvites.length} คน</span></div>
				{pendingInvites.length === 0 ? <p className="border border-dashed border-[#d9d2e5] px-4 py-5 text-center text-xs text-[#817a8f]">ไม่มีคำขอที่รออนุมัติ ผู้รับลิงก์จะปรากฏที่นี่หลังกรอกชื่อและเปิดหน้าดูสต็อก</p> : <div className="divide-y divide-[#f0edf4] border border-[#e9e3f2] bg-white">{pendingInvites.map((invite) => <div key={invite.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-[#383148]">{invite.name}</p><p className="mt-1 text-xs text-[#817a8f]">@{invite.username} · กำลังดูสต็อกแบบอ่านอย่างเดียว</p></div><label className="flex items-center gap-2 text-xs text-[#70697d]"><span>อนุมัติเป็น</span><select aria-label={`อนุมัติ ${invite.username} เป็นสมาชิก`} className="min-h-9 rounded-md border border-[#d9d2e5] bg-white px-2 text-xs text-[#514b60] focus:border-[#6840c8] focus:outline-none" value="pending" onChange={(event) => onGrantInviteRole(invite.id, event.target.value as Exclude<StaffRole, "pending">)}><option value="pending">เลือกสิทธิ์</option><option value="ดูข้อมูล">ดูข้อมูล</option><option value="พนักงานขาย">พนักงานขาย</option><option value="ผู้จัดการ">ผู้จัดการ</option></select></label></div>)}</div>}
			</section>}
			<h3 className="mb-3 text-sm font-semibold text-[#383148]">สมาชิกในทีม</h3>
			<div className="overflow-x-auto border border-[#e9e3f2] bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#faf9fc] text-xs text-[#70697d]"><tr><th className="px-4 py-3 font-medium">สมาชิก</th><th className="px-4 py-3 font-medium">ชื่อผู้ใช้ / อีเมล</th><th className="px-4 py-3 font-medium">สิทธิ์ทีม</th>{ownerView && <th className="px-4 py-3 font-medium">อนุญาตให้จบรอบ</th>}</tr></thead><tbody className="divide-y divide-[#f0edf4]">{staff.map((member) => <tr key={member.id}><td className="px-4 py-3 font-medium text-[#383148]">{member.name}</td><td className="px-4 py-3 text-[#70697d]">{member.email}</td><td className="px-4 py-3">{ownerView ? <select aria-label={`สิทธิ์ของ ${member.name}`} className="rounded-md border border-[#d9d2e5] bg-white px-2.5 py-2 text-xs text-[#514b60] focus:border-[#6840c8] focus:outline-none" value={member.role} onChange={(event) => onChangeRole(member.id, event.target.value as Staff["role"])}><option>ผู้จัดการ</option><option>พนักงานขาย</option><option>ดูข้อมูล</option></select> : <span className="text-xs text-[#514b60]">{member.role}</span>}</td>{ownerView && <td className="px-4 py-3 text-xs text-[#817a8f]">เจ้าของรอบขาย</td>}</tr>)}{approvedInvites.map((invite) => <tr key={invite.id}><td className="px-4 py-3 font-medium text-[#383148]">{invite.name}</td><td className="px-4 py-3 text-[#70697d]">@{invite.username}</td><td className="px-4 py-3">{ownerView ? <select aria-label={`สิทธิ์ของ ${invite.username}`} className="rounded-md border border-[#d9d2e5] bg-white px-2.5 py-2 text-xs text-[#514b60] focus:border-[#6840c8] focus:outline-none" value={invite.role} onChange={(event) => onGrantInviteRole(invite.id, event.target.value as Exclude<StaffRole, "pending">)}><option>ผู้จัดการ</option><option>พนักงานขาย</option><option>ดูข้อมูล</option></select> : <span className="text-xs text-[#514b60]">{invite.role}</span>}</td>{ownerView && <td className="px-4 py-3"><label className="flex items-center gap-2 text-xs text-[#514b60]"><input type="checkbox" checked={invite.canEndSalesRun} onChange={(event) => updateStaffInviteEndPermission(invite.id, event.target.checked)} className="size-4 accent-[#6840c8]" />อนุญาต</label></td>}</tr>)}</tbody></table></div>
		</section>
	);
}

function ActivityPanel({ entries }: { entries: string[] }) {
	return (
		<section aria-label="ประวัติการแก้ไข">
			<PanelTitle eyebrow="ตรวจสอบย้อนหลัง" title="ประวัติแก้ไขรอบขาย" description="รายการกิจกรรมที่เกิดขึ้นในรอบขายนี้" />
			<ol className="divide-y divide-[#eee9f5] border border-[#e9e3f2] bg-white">{entries.map((entry, index) => <li key={`${entry}-${index}`} className="flex gap-3 px-4 py-4 text-sm"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#f1eef8] text-xs text-[#6840c8]">{index + 1}</span><span className="pt-1 text-[#514b60]">{entry}</span></li>)}</ol>
		</section>
	);
}

export default function OngoingSalesRunPage() {
	const { id: runId } = useParams<{ id: string }>();
	const router = useRouter();
	const runs = useSyncExternalStore(subscribeToSalesRuns, getSalesRunsSnapshot, getServerSalesRunsSnapshot);
	const staffInvites = useSyncExternalStore(subscribeToStaffInvites, getStaffInvitesSnapshot, getServerStaffInvitesSnapshot).filter((invite) => invite.runId === runId);
	const searchParams = useSearchParams();
	const staffSessionInviteId = searchParams.get("invite");
	const staffSession = staffSessionInviteId ? staffInvites.find((invite) => invite.id === staffSessionInviteId && invite.role !== "pending") : undefined;
	const isOwnerView = !staffSessionInviteId;
	const currentRun = runs.find((run) => run.id === runId);
	const staffSessionInvalid = Boolean(staffSessionInviteId && !staffSession);
	const canManageRun = isOwnerView || staffSession?.role === "ผู้จัดการ" || staffSession?.role === "พนักงานขาย";
	const [view, setView] = useState<View>("overview");
	const [products, setProducts] = useState(initialProducts);
	const [sales, setSales] = useState(initialSales);
	const [suppliers, setSuppliers] = useState(initialSuppliers);
	const [staff, setStaff] = useState<Staff[]>([
		{ id: "m1", name: "Nicha S.", email: "nicha@example.com", role: "ผู้จัดการ" },
		{ id: "m2", name: "Ploy K.", email: "ploy@example.com", role: "พนักงานขาย" },
		{ id: "m3", name: "Ton A.", email: "ton@example.com", role: "ดูข้อมูล" },
	]);
	const [expenses, setExpenses] = useState<Expense[]>([
		{ id: "e1", name: "ค่าเช่าพื้นที่", amount: 1200 },
		{ id: "e2", name: "อุปกรณ์จัดบูท", amount: 350 },
	]);
	const [activity, setActivity] = useState(["เริ่มรอบขาย · วันนี้ 10:00", "เพิ่มสินค้า 4 รายการ", "เพิ่มซัพพลายเออร์ 2 ราย"]);
	const [shareLink, setShareLink] = useState("");
	const [showEndConfirm, setShowEndConfirm] = useState(false);
	const canEndSalesRun = isOwnerView || staffSession?.canEndSalesRun === true;
	const isEnded = currentRun?.status === "ended";

	useEffect(() => {
		if (staffSessionInvalid && currentRun) {
			router.replace(`/sales-run/view-status/${encodeURIComponent(runId)}${staffSessionInviteId ? `?invite=${encodeURIComponent(staffSessionInviteId)}` : ""}`);
		}
	}, [currentRun, router, runId, staffSessionInviteId, staffSessionInvalid]);

	const totalSales = sales.reduce((total, sale) => total + sale.amount, 0);
	const itemCount = sales.reduce((total, sale) => total + sale.quantity, 0);
	const expenseTotal = expenses.reduce((total, expense) => total + expense.amount, 0);
	const supplierExpenseShare = suppliers.length > 0 ? Math.round(expenseTotal / suppliers.length) : 0;

	function recordSale(product: Product, quantity: number, amount: number, channel: string) {
		if (product.stock < quantity || quantity < 1 || amount < 0 || isEnded) return;
		const time = new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit" }).format(new Date());
		setProducts((current) => current.map((item) => item.id === product.id ? { ...item, stock: item.stock - quantity, sold: item.sold + quantity } : item));
		setSales((current) => [{ id: makeId(), product: product.name, quantity, amount, channel, time }, ...current]);
		setActivity((current) => [`บันทึกขาย ${product.name} × ${quantity} · ${money(amount)} · ${channel}`, ...current]);
	}

	function selectView(nextView: View) {
		setView(nextView);
		setShowEndConfirm(false);
	}

	const recentSales = [...sales].slice(0, 4);
	const viewContent: Record<View, React.ReactNode> = {
		overview: <Overview products={products} sales={recentSales} suppliers={suppliers} expenses={expenses} totalSales={totalSales} itemCount={itemCount} expenseTotal={expenseTotal} onSelect={selectView} />,
		board: <SalesBoard products={products} onSell={recordSale} ended={isEnded || Boolean(staffSessionInviteId && !staffSession)} />,
		sales: <SalesLog sales={sales} />,
		stock: <StockPanel suppliers={suppliers} products={products} onAdd={(product) => { setProducts((current) => [...current, product]); setActivity((current) => [`เพิ่ม ${product.name} เข้าสต็อกจาก ${product.supplier} · ${product.stock} ชิ้น`, ...current]); }} onAdjust={(id, amount) => setProducts((current) => current.map((product) => product.id === id ? { ...product, stock: Math.max(0, product.stock + amount) } : product))} />,
		suppliers: <SuppliersPanel suppliers={suppliers} onAdd={(supplier) => { setSuppliers((current) => [...current, supplier]); setActivity((current) => [`เพิ่มซัพพลายเออร์ ${supplier.name}`, ...current]); }} onRename={(id, name, contact) => { const supplier = suppliers.find((item) => item.id === id); if (!supplier) return; const nextName = name || supplier.name; setSuppliers((current) => current.map((item) => item.id === id ? { ...item, name: nextName, contact: contact || item.contact } : item)); setProducts((current) => current.map((product) => product.supplier === supplier.name ? { ...product, supplier: nextName } : product)); }} onAddProduct={(id, item) => { const supplier = suppliers.find((candidate) => candidate.id === id); if (!supplier || supplier.products.some((product) => product.name === item.name)) return; setSuppliers((current) => current.map((candidate) => candidate.id === id ? { ...candidate, products: [...candidate.products, item] } : candidate)); setActivity((current) => [`เพิ่มสินค้า ${item.name} · ${supplier.name} · ${money(item.price)}`, ...current]); }} onUpdateProduct={(supplierId, previousName, updatedItem) => { const supplier = suppliers.find((item) => item.id === supplierId); if (!supplier || (updatedItem.name !== previousName && supplier.products.some((item) => item.name === updatedItem.name))) return; setSuppliers((current) => current.map((item) => item.id === supplierId ? { ...item, products: item.products.map((product) => product.name === previousName ? updatedItem : product) } : item)); setProducts((current) => current.map((product) => product.supplier === supplier.name && product.name === previousName ? { ...product, name: updatedItem.name, price: updatedItem.price } : product)); setActivity((current) => [`แก้ไขสินค้า ${previousName} · ${supplier.name} · ${money(updatedItem.price)}`, ...current]); }} onDeleteProduct={(supplierId, productName) => { const supplier = suppliers.find((item) => item.id === supplierId); if (!supplier) return; setSuppliers((current) => current.map((item) => item.id === supplierId ? { ...item, products: item.products.filter((product) => product.name !== productName) } : item)); setProducts((current) => current.filter((product) => !(product.supplier === supplier.name && product.name === productName))); setActivity((current) => [`ลบสินค้า ${productName} · ${supplier.name}`, ...current]); }} />,
		expenses: <ExpensesPanel expenses={expenses} onAdd={(expense) => { setExpenses((current) => [...current, expense]); setActivity((current) => [`เพิ่มค่าใช้จ่าย ${expense.name} · ${money(expense.amount)}`, ...current]); }} onRemove={(id) => setExpenses((current) => current.filter((expense) => expense.id !== id))} />,
		staff: <StaffPanel staff={staff} invites={staffInvites} onChangeRole={(id, role) => setStaff((current) => current.map((member) => member.id === id ? { ...member, role } : member))} onGrantInviteRole={updateStaffInviteRole} shareLink={shareLink} onGenerateShareLink={() => setShareLink(`${window.location.origin}/auth/login/${encodeURIComponent(runId)}`)} ownerView={isOwnerView} />,
		activity: <ActivityPanel entries={activity} />,
	};

	if (!currentRun) {
		return (
			<div className="flex min-h-0 flex-1 flex-col bg-[#f6f4fa] text-[#28213a]">
				<AfterLoginHeader />
				<main className="grid flex-1 place-items-center px-4 py-12">
					<section className="w-full max-w-md border border-[#e9e3f2] bg-white p-6 text-center">
						<h1 className="text-lg font-semibold text-[#383148]">{runs.length === 0 ? "กำลังโหลดรอบขาย" : "ไม่พบรอบขายนี้"}</h1>
						<p className="mt-2 text-sm text-[#817a8f]">{runs.length === 0 ? "กรุณารอสักครู่" : `ไม่พบข้อมูลสำหรับรอบขาย ${runId}`}</p>
						<Link href="/sales-run" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white hover:bg-[#5633ac]">กลับไปหน้ารอบขาย</Link>
					</section>
				</main>
			</div>
		);
	}

	if (!canManageRun) {
		return (
			<div className="flex min-h-0 flex-1 flex-col bg-[#f6f4fa] text-[#28213a]">
				<AfterLoginHeader />
				<main className="grid flex-1 place-items-center px-4 py-12">
					<section className="w-full max-w-md border border-[#e9e3f2] bg-white p-6 text-center">
						<h1 className="text-lg font-semibold text-[#383148]">สิทธิ์ยังไม่เพียงพอ</h1>
						<p className="mt-2 text-sm text-[#817a8f]">บัญชีนี้ดูสถานะสต็อกได้ แต่ยังไม่มีสิทธิ์จัดการรอบขาย</p>
						<Link href={`/sales-run/view-status/${encodeURIComponent(runId)}?invite=${encodeURIComponent(staffSessionInviteId ?? "")}`} className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white hover:bg-[#5633ac]">กลับไปดูสถานะสต็อก</Link>
					</section>
				</main>
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-[#f6f4fa] text-[#28213a]">
			<AfterLoginHeader />
			<div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
				<header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<div className="flex flex-wrap items-center gap-2"><p className="text-xs font-semibold uppercase text-[#6840c8]">รอบขาย</p><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${isEnded ? "bg-[#f3e9ed] text-[#7b5365]" : "bg-[#e6f2ec] text-[#27654f]"}`}>{isEnded ? "สิ้นสุดแล้ว" : "กำลังดำเนินการ"}</span>{runId.startsWith("mock-") && <span className="text-xs text-[#817a8f]">ข้อมูลตัวอย่าง</span>}</div>
						<h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{currentRun.name}</h1>
						<p className="mt-2 text-sm text-[#70697d]">{currentRun.date ? new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${currentRun.date}T00:00:00`)) : "ไม่ระบุวันที่"} <span aria-hidden="true">·</span> รอบขาย #{runId}</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<button type="button" onClick={() => selectView("staff")} className="min-h-10 border border-[#d9d2e5] bg-white px-3.5 text-sm font-semibold text-[#514b60] hover:border-[#6840c8] hover:text-[#6840c8]">เชิญทีมงาน</button>
						{canEndSalesRun && <button type="button" disabled={isEnded} onClick={() => setShowEndConfirm(true)} className="min-h-10 border border-[#e5cfd7] bg-white px-3.5 text-sm font-semibold text-[#875166] hover:bg-[#fbf5f7] disabled:opacity-45">จบรอบขาย</button>}
					</div>
				</header>

				<div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
					<Stat label="ยอดขายรวม" value={money(totalSales)} note={`${sales.length} รายการบันทึก`} tone="green" />
					<Stat label="สินค้าที่ขายแล้ว" value={`${itemCount} ชิ้น`} note="รวมทุกรายการ" />
					<Stat label="ค่าใช้จ่ายต่อซัพพลายเออร์" value={suppliers.length > 0 ? money(supplierExpenseShare) : "—"} note={suppliers.length > 0 ? `หารค่าใช้จ่าย ${money(expenseTotal)} ÷ ${suppliers.length} ราย` : "เพิ่มซัพพลายเออร์เพื่อแบ่งค่าใช้จ่าย"} />
					<Stat label="ค่าใช้จ่าย" value={money(expenseTotal)} note={`${expenses.length} รายการ`} />
				</div>

				<div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
					<nav aria-label="เมนูจัดการรอบขาย" className="grid grid-cols-2 gap-1 self-start border border-[#e9e3f2] bg-white p-2 sm:grid-cols-4 lg:flex lg:flex-col">
						{navItems.map((item) => <button key={item.id} type="button" onClick={() => selectView(item.id)} aria-current={view === item.id ? "page" : undefined} className={`flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium transition-colors sm:text-sm ${view === item.id ? "bg-[#f1eef8] text-[#604594]" : "text-[#625c70] hover:bg-[#faf9fc] hover:text-[#6840c8]"}`}><span className="w-5 text-center text-sm" aria-hidden="true">{item.mark}</span><span>{item.label}</span></button>)}
					</nav>

					<div className="min-w-0 border border-[#e9e3f2] bg-white p-4 sm:p-6 lg:p-7">
						{viewContent[view]}
					</div>
				</div>
			</div>

			{showEndConfirm && <div className="fixed inset-0 z-50 grid place-items-center bg-[#211a35]/35 p-4"><section role="alertdialog" aria-modal="true" aria-labelledby="end-run-title" className="w-full max-w-md border border-[#e5deef] bg-white p-6 shadow-xl"><h2 id="end-run-title" className="text-lg font-semibold text-[#28213a]">จบรอบขายนี้หรือไม่?</h2><p className="mt-2 text-sm leading-6 text-[#70697d]">หลังจากจบรอบ จะไม่สามารถบันทึกยอดขายใหม่ได้</p><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setShowEndConfirm(false)} className="min-h-10 rounded-lg border border-[#d9d2e5] px-4 text-sm font-semibold text-[#514b60]">ยกเลิก</button><button type="button" onClick={() => { updateSalesRunStatus(runId, "ended"); router.push(`/sales-run/complete?id=${encodeURIComponent(runId)}`); }} className="min-h-10 rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white hover:bg-[#5633ac]">ยืนยันจบรอบ</button></div></section></div>}
		</div>
	);
}

function Overview({ products, sales, suppliers, expenses, totalSales, itemCount, expenseTotal, onSelect }: { products: Product[]; sales: Sale[]; suppliers: Supplier[]; expenses: Expense[]; totalSales: number; itemCount: number; expenseTotal: number; onSelect: (view: View) => void }) {
	return (
		<div className="space-y-7">
			<section aria-label="ภาพรวมรอบขาย">
				<PanelTitle eyebrow="ภาพรวม" title="จัดการรอบขาย" description="เลือกส่วนที่ต้องการจัดการ หรือไปยังกระดานขายเพื่อบันทึกรายการใหม่" />
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{[
						{ id: "sales" as const, title: "ดูประวัติการขาย", detail: `${sales.length} รายการ · ${money(totalSales)}`, symbol: "↗" },
						{ id: "stock" as const, title: "จัดการสต็อกสินค้า", detail: `${products.length} รายการสินค้า · ${itemCount} ชิ้นขายแล้ว`, symbol: "▤" },
						{ id: "suppliers" as const, title: "จัดการซัพพลายเออร์", detail: `${suppliers.length} รายชื่อผู้ฝากขาย`, symbol: "♧" },
						{ id: "expenses" as const, title: "จัดการค่าใช้จ่าย", detail: `${expenses.length} รายการ · ${money(expenseTotal)}`, symbol: "−" },
						{ id: "staff" as const, title: "เชิญทีมและจัดการสิทธิ์", detail: "จัดการผู้ร่วมงานและระดับการเข้าถึง", symbol: "♙" },
						{ id: "activity" as const, title: "ดูประวัติการแก้ไข", detail: "ตรวจสอบกิจกรรมของรอบขาย", symbol: "◷" },
					].map((action) => <button key={action.id} type="button" onClick={() => onSelect(action.id)} className="group flex min-h-24 items-start gap-3 border border-[#e9e3f2] bg-white p-4 text-left transition-colors hover:border-[#b7a3dd] hover:bg-[#faf9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f1eef8] text-lg text-[#6840c8]">{action.symbol}</span><span><span className="block text-sm font-semibold text-[#383148] group-hover:text-[#604594]">{action.title}</span><span className="mt-1 block text-xs leading-5 text-[#817a8f]">{action.detail}</span></span><span className="ml-auto text-[#a29bad] group-hover:text-[#6840c8]" aria-hidden="true">→</span></button>)}
				</div>
			</section>
			<section aria-label="รายการขายล่าสุด">
				<div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-semibold text-[#383148]">รายการขายล่าสุด</h3><button type="button" onClick={() => onSelect("sales")} className="text-xs font-semibold text-[#6840c8] hover:underline">ดูทั้งหมด</button></div>
				<div className="divide-y divide-[#f0edf4] border border-[#e9e3f2]">{sales.map((sale) => <div key={sale.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"><div><p className="font-medium text-[#514b60]">{sale.product}</p><p className="mt-0.5 text-xs text-[#817a8f]">{sale.time} · {sale.quantity} ชิ้น · {sale.channel}</p></div><span className="font-semibold text-[#28213a]">{money(sale.amount)}</span></div>)}</div>
			</section>
		</div>
	);
}
