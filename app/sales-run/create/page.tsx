"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import AfterLoginHeader from "../../../components/layout/AfterLoginHeader";
import { saveSalesRun } from "../../../lib/salesRuns";

type SupplierProduct = {
	id: string;
	name: string;
	price: number;
	quantity: number;
};

type Supplier = {
	id: string;
	name: string;
	products: SupplierProduct[];
};

type Product = SupplierProduct;

type Expense = {
	id: string;
	name: string;
	amount: number;
};

const steps = ["ตั้งชื่อรอบขาย", "เพิ่มซัพพลายเออร์", "เพิ่มสินค้า", "เพิ่มค่าใช้จ่าย", "ตรวจสอบ"];

const inputClassName =
	"min-h-11 w-full rounded-lg border border-[#d9d2e5] bg-white px-3.5 py-2.5 text-sm text-[#28213a] outline-none placeholder:text-[#a29bad] focus:border-[#6840c8] focus:ring-3 focus:ring-[#6840c8]/15";

function makeId() {
	return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("th-TH", {
		style: "currency",
		currency: "THB",
		maximumFractionDigits: 2,
	}).format(amount);
}

function Field({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<label className="block space-y-1.5 text-sm font-medium text-[#393249]">
			<span>{label}</span>
			{children}
		</label>
	);
}

function StepProgress({ currentStep, onSelect }: { currentStep: number; onSelect: (step: number) => void }) {
	return (
		<nav aria-label="ขั้นตอนสร้างรอบขาย" className="grid grid-cols-5 border-b border-[#ebe6f3] bg-white">
			{steps.map((step, index) => {
				const isCurrent = currentStep === index;
				const isComplete = currentStep > index;
				return (
					<button
						key={step}
						type="button"
						onClick={() => onSelect(index)}
						disabled={index > currentStep}
						aria-current={isCurrent ? "step" : undefined}
						className={`relative flex min-w-0 flex-col items-center gap-2 px-1 py-4 text-center text-[10px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:flex-row sm:justify-center sm:gap-2 sm:px-3 sm:text-xs ${isCurrent ? "text-[#6840c8]" : isComplete ? "text-[#514b60]" : "text-[#8b8598]"}`}
					>
						<span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${isCurrent ? "bg-[#6840c8] text-white" : isComplete ? "bg-[#eee9f8] text-[#6840c8]" : "bg-[#f3f1f6] text-[#817a8f]"}`}>
							{isComplete ? "✓" : String(index + 1).padStart(2, "0")}
						</span>
						<span className="leading-tight">{step}</span>
					</button>
				);
			})}
		</nav>
	);
}

function StepHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
	return (
		<div className="mb-7">
			<p className="text-xs font-semibold uppercase text-[#6840c8]">{eyebrow}</p>
			<h2 className="mt-2 text-2xl font-semibold text-[#28213a]">{title}</h2>
			<p className="mt-2 text-sm leading-6 text-[#70697d]">{description}</p>
		</div>
	);
}

function RunDetailsStep({
	name,
	date,
	onNameChange,
	onDateChange,
}: {
	name: string;
	date: string;
	onNameChange: (name: string) => void;
	onDateChange: (date: string) => void;
}) {
	return (
		<section aria-labelledby="run-details-title">
			<StepHeading
				eyebrow="ขั้นตอนที่ 1"
				title="ตั้งชื่อรอบขาย"
				description="ตั้งชื่อให้งานหรืออีเวนต์นี้ เพื่อค้นหาและตรวจสอบยอดได้ง่าย"
			/>
			<div className="grid gap-5 sm:grid-cols-2">
				<Field label="ชื่อรอบขาย *">
					<input
						className={inputClassName}
						value={name}
						onChange={(event) => onNameChange(event.target.value)}
						placeholder="เช่น Art Market เดือนตุลาคม"
						autoComplete="off"
						required
					/>
				</Field>
				<Field label="วันที่จัดงาน (ไม่บังคับ)">
					<input
						className={inputClassName}
						type="date"
						value={date}
						onChange={(event) => onDateChange(event.target.value)}
					/>
				</Field>
			</div>
		</section>
	);
}

function ProductEntryForm({
	buttonLabel,
	onAdd,
}: {
	buttonLabel: string;
	onAdd: (product: Omit<Product, "id">) => void;
}) {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [quantity, setQuantity] = useState("1");

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const numericPrice = Number(price);
		const numericQuantity = Number(quantity);
		if (!name.trim() || numericPrice < 0 || numericQuantity < 1) return;
		onAdd({ name: name.trim(), price: numericPrice, quantity: numericQuantity });
		setName("");
		setPrice("");
		setQuantity("1");
	}

	return (
		<form onSubmit={handleSubmit} className="grid gap-3 rounded-lg border border-[#ebe6f3] bg-[#faf9fc] p-4 sm:grid-cols-[1.4fr_1fr_0.7fr_auto] sm:items-end">
			<Field label="ชื่อสินค้า *">
				<input className={inputClassName} value={name} onChange={(event) => setName(event.target.value)} placeholder="ชื่อผลงานหรือสินค้า" required />
			</Field>
			<Field label="ราคาต่อชิ้น *">
				<input className={inputClassName} type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0.00" required />
			</Field>
			<Field label="จำนวน *">
				<input className={inputClassName} type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
			</Field>
			<button type="submit" className="min-h-11 rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#5633ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]">
				{buttonLabel}
			</button>
		</form>
	);
}

function SuppliersStep({
	suppliers,
	onAddSupplier,
	onAddSupplierProduct,
	onRemoveSupplier,
}: {
	suppliers: Supplier[];
	onAddSupplier: (name: string) => void;
	onAddSupplierProduct: (supplierId: string, product: Omit<Product, "id">) => void;
	onRemoveSupplier: (supplierId: string) => void;
}) {
	const [supplierName, setSupplierName] = useState("");

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!supplierName.trim()) return;
		onAddSupplier(supplierName.trim());
		setSupplierName("");
	}

	return (
		<section aria-label="เพิ่มซัพพลายเออร์">
			<StepHeading
				eyebrow="ขั้นตอนที่ 2"
				title="เพิ่มซัพพลายเออร์และสินค้า"
				description="เพิ่มผู้ฝากขายทีละราย แล้วบันทึกผลงานที่รับฝากภายใต้ชื่อของแต่ละราย"
			/>
			<form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row">
				<input className={inputClassName} value={supplierName} onChange={(event) => setSupplierName(event.target.value)} placeholder="ชื่อซัพพลายเออร์หรือศิลปิน" aria-label="ชื่อซัพพลายเออร์" required />
				<button type="submit" className="min-h-11 shrink-0 rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#5633ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]">
					เพิ่มซัพพลายเออร์
				</button>
			</form>
			{suppliers.length === 0 ? (
				<p className="rounded-lg border border-dashed border-[#d9d2e5] px-4 py-7 text-center text-sm text-[#817a8f]">ยังไม่มีซัพพลายเออร์ เพิ่มรายแรกด้านบน</p>
			) : (
				<div className="space-y-4">
					{suppliers.map((supplier) => (
						<article key={supplier.id} className="border border-[#e5deef] bg-white">
							<div className="flex items-center justify-between gap-3 border-b border-[#eee9f5] px-4 py-3">
								<div>
									<h3 className="font-semibold text-[#383148]">{supplier.name}</h3>
									<p className="mt-0.5 text-xs text-[#817a8f]">{supplier.products.length} รายการสินค้า</p>
								</div>
								<button type="button" onClick={() => onRemoveSupplier(supplier.id)} className="rounded px-2 py-1 text-xs font-medium text-[#7b5365] hover:bg-[#f8f3f6] focus-visible:outline-2 focus-visible:outline-[#6840c8]">
									นำออก
								</button>
							</div>
							<div className="space-y-3 p-4">
								<ProductEntryForm
									buttonLabel="เพิ่มสินค้า"
									onAdd={(product) => onAddSupplierProduct(supplier.id, product)}
								/>
								{supplier.products.length > 0 && (
									<ul className="divide-y divide-[#f0edf4]">
										{supplier.products.map((product) => (
											<li key={product.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2 text-sm">
												<span className="text-[#514b60]">{product.name} <span className="text-[#817a8f]">× {product.quantity}</span></span>
												<span className="font-medium text-[#383148]">{formatCurrency(product.price)}</span>
											</li>
										))}
									</ul>
								)}
							</div>
						</article>
					))}
				</div>
			)}
		</section>
	);
}

function ProductsStep({ products, onAddProduct, onRemoveProduct }: { products: Product[]; onAddProduct: (product: Omit<Product, "id">) => void; onRemoveProduct: (id: string) => void }) {
	return (
		<section aria-label="เพิ่มสินค้า">
			<StepHeading
				eyebrow="ขั้นตอนที่ 3"
				title="เพิ่มสินค้าของรอบขาย"
				description="เพิ่มสินค้าที่จัดการโดยบูทเอง แยกจากรายการสินค้าฝากขายของซัพพลายเออร์"
			/>
			<ProductEntryForm buttonLabel="เพิ่มสินค้า" onAdd={onAddProduct} />
			{products.length > 0 ? (
				<ul className="mt-4 divide-y divide-[#eee9f5] border-y border-[#eee9f5]">
					{products.map((product) => (
						<li key={product.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
							<div><span className="font-medium text-[#383148]">{product.name}</span><span className="ml-2 text-[#817a8f]">× {product.quantity}</span></div>
							<div className="flex items-center gap-3"><span className="font-medium text-[#514b60]">{formatCurrency(product.price)}</span><button type="button" onClick={() => onRemoveProduct(product.id)} className="text-xs font-medium text-[#7b5365] hover:underline">ลบ</button></div>
						</li>
					))}
				</ul>
			) : <p className="mt-4 rounded-lg border border-dashed border-[#d9d2e5] px-4 py-6 text-center text-sm text-[#817a8f]">ยังไม่มีสินค้าเพิ่มในขั้นตอนนี้</p>}
		</section>
	);
}

function ExpensesStep({ expenses, onAddExpense, onRemoveExpense }: { expenses: Expense[]; onAddExpense: (expense: Omit<Expense, "id">) => void; onRemoveExpense: (id: string) => void }) {
	const [name, setName] = useState("");
	const [amount, setAmount] = useState("");

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const numericAmount = Number(amount);
		if (!name.trim() || numericAmount < 0) return;
		onAddExpense({ name: name.trim(), amount: numericAmount });
		setName("");
		setAmount("");
	}

	return (
		<section aria-label="เพิ่มค่าใช้จ่าย">
			<StepHeading
				eyebrow="ขั้นตอนที่ 4"
				title="เพิ่มค่าใช้จ่ายของงาน"
				description="บันทึกค่าใช้จ่ายที่เกี่ยวข้อง เพื่อประกอบการตรวจสอบยอดหลังจบงาน"
			/>
			<form onSubmit={handleSubmit} className="grid gap-3 rounded-lg border border-[#ebe6f3] bg-[#faf9fc] p-4 sm:grid-cols-[1.5fr_1fr_auto] sm:items-end">
				<Field label="รายการค่าใช้จ่าย *"><input className={inputClassName} value={name} onChange={(event) => setName(event.target.value)} placeholder="เช่น ค่าเช่าพื้นที่" required /></Field>
				<Field label="จำนวนเงิน *"><input className={inputClassName} type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" required /></Field>
				<button type="submit" className="min-h-11 rounded-lg bg-[#6840c8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#5633ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]">เพิ่มค่าใช้จ่าย</button>
			</form>
			{expenses.length > 0 ? (
				<ul className="mt-4 divide-y divide-[#eee9f5] border-y border-[#eee9f5]">
					{expenses.map((expense) => (
						<li key={expense.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
							<span className="text-[#514b60]">{expense.name}</span>
							<div className="flex items-center gap-3"><span className="font-medium text-[#383148]">{formatCurrency(expense.amount)}</span><button type="button" onClick={() => onRemoveExpense(expense.id)} className="text-xs font-medium text-[#7b5365] hover:underline">ลบ</button></div>
						</li>
					))}
				</ul>
			) : <p className="mt-4 rounded-lg border border-dashed border-[#d9d2e5] px-4 py-6 text-center text-sm text-[#817a8f]">ยังไม่มีค่าใช้จ่าย เพิ่มได้หากมี</p>}
		</section>
	);
}

function ReviewStep({ runName, date, suppliers, products, expenses }: { runName: string; date: string; suppliers: Supplier[]; products: Product[]; expenses: Expense[] }) {
	const supplierProductCount = suppliers.reduce((total, supplier) => total + supplier.products.length, 0);
	const productValue = [...products, ...suppliers.flatMap((supplier) => supplier.products)].reduce((total, product) => total + product.price * product.quantity, 0);
	const expenseTotal = expenses.reduce((total, expense) => total + expense.amount, 0);

	return (
		<section aria-label="ตรวจสอบข้อมูลรอบขาย">
			<StepHeading
				eyebrow="ขั้นตอนที่ 5"
				title="ตรวจสอบรอบขาย"
				description="ตรวจรายละเอียดก่อนจบการตั้งค่า ข้อมูลยังอยู่ในหน้านี้เท่านั้น"
			/>
			<div className="grid gap-3 sm:grid-cols-3">
				<SummaryItem label="รอบขาย" value={runName || "ยังไม่ได้ตั้งชื่อ"} />
				<SummaryItem label="วันที่จัดงาน" value={date || "ไม่ได้ระบุ"} />
				<SummaryItem label="ซัพพลายเออร์" value={`${suppliers.length} ราย`} />
				<SummaryItem label="สินค้า" value={`${supplierProductCount + products.length} รายการ`} />
				<SummaryItem label="มูลค่าสินค้ารวม" value={formatCurrency(productValue)} />
				<SummaryItem label="ค่าใช้จ่ายรวม" value={formatCurrency(expenseTotal)} />
			</div>
			<div className="mt-5 rounded-lg border border-[#e5deef] bg-[#faf9fc] p-4 text-sm leading-6 text-[#625c70]">
				เมื่อยืนยัน ระบบจะแสดงสถานะเสร็จสิ้นในหน้าตัวอย่างนี้ ข้อมูลยังไม่ได้บันทึกไปยังฐานข้อมูล
			</div>
		</section>
	);
}

function SummaryItem({ label, value }: { label: string; value: string }) {
	return (
		<div className="border border-[#ebe6f3] bg-white p-4">
			<p className="text-xs text-[#817a8f]">{label}</p>
			<p className="mt-1 break-words text-base font-semibold text-[#383148]">{value}</p>
		</div>
	);
}

export default function CreateSalesRunPage() {
	const [currentStep, setCurrentStep] = useState(0);
	const [runName, setRunName] = useState("");
	const [date, setDate] = useState("");
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [isComplete, setIsComplete] = useState(false);
	const [savedSuccessfully, setSavedSuccessfully] = useState(false);

	function goNext() {
		if (currentStep === 0 && !runName.trim()) return;
		setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
	}

	function addSupplier(name: string) {
		setSuppliers((current) => [...current, { id: makeId(), name, products: [] }]);
	}

	function addSupplierProduct(supplierId: string, product: Omit<Product, "id">) {
		setSuppliers((current) => current.map((supplier) => supplier.id === supplierId
			? { ...supplier, products: [...supplier.products, { ...product, id: makeId() }] }
			: supplier));
	}

	function completeRun() {
		const saved = saveSalesRun({
			id: makeId(),
			name: runName.trim(),
			date,
			status: "ongoing",
			supplierCount: suppliers.length,
			productCount: products.length + suppliers.reduce((total, supplier) => total + supplier.products.length, 0),
			expenseTotal: expenses.reduce((total, expense) => total + expense.amount, 0),
			createdAt: new Date().toISOString(),
		});
		setSavedSuccessfully(saved);
		setIsComplete(true);
	}

	const panels = [
		<RunDetailsStep key="details" name={runName} date={date} onNameChange={setRunName} onDateChange={setDate} />,
		<SuppliersStep
			key="suppliers"
			suppliers={suppliers}
			onAddSupplier={addSupplier}
			onAddSupplierProduct={addSupplierProduct}
			onRemoveSupplier={(supplierId) => setSuppliers((current) => current.filter((supplier) => supplier.id !== supplierId))}
		/>,
		<ProductsStep
			key="products"
			products={products}
			onAddProduct={(product) => setProducts((current) => [...current, { ...product, id: makeId() }])}
			onRemoveProduct={(id) => setProducts((current) => current.filter((product) => product.id !== id))}
		/>,
		<ExpensesStep
			key="expenses"
			expenses={expenses}
			onAddExpense={(expense) => setExpenses((current) => [...current, { ...expense, id: makeId() }])}
			onRemoveExpense={(id) => setExpenses((current) => current.filter((expense) => expense.id !== id))}
		/>,
		<ReviewStep key="review" runName={runName} date={date} suppliers={suppliers} products={products} expenses={expenses} />,
	];

	if (isComplete) {
		return (
			<div className="flex min-h-0 flex-1 flex-col bg-[#f6f4fa]">
				<AfterLoginHeader />
				<main className="grid flex-1 place-items-center px-4 py-12 text-[#28213a]">
					<section className="w-full max-w-lg border border-[#e5deef] bg-white p-7 text-center shadow-[0_16px_50px_-36px_rgba(45,32,72,0.35)] sm:p-10">
						<span className="mx-auto grid size-12 place-items-center rounded-full bg-[#eee9f8] text-xl font-semibold text-[#6840c8]">✓</span>
						<h1 className="mt-5 text-2xl font-semibold">ตั้งค่ารอบขายเรียบร้อย</h1>
						<p className="mt-3 text-sm leading-6 text-[#70697d]">“{runName}” {savedSuccessfully ? "บันทึกไว้ในเบราว์เซอร์นี้แล้ว" : "ตั้งค่าเสร็จแล้ว แต่บันทึกในเบราว์เซอร์ไม่สำเร็จ"} ข้อมูลยังไม่ได้ส่งไปยังเซิร์ฟเวอร์</p>
						<div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
							<Link href="/sales-run" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#6840c8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5633ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]">ดูรายการรอบขาย</Link>
							<button type="button" onClick={() => { setIsComplete(false); setCurrentStep(0); }} className="min-h-11 rounded-lg border border-[#d9d2e5] px-5 py-2.5 text-sm font-semibold text-[#514b60] hover:bg-[#faf9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]">กลับไปแก้ไข</button>
						</div>
					</section>
				</main>
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-[#f6f4fa]">
			<AfterLoginHeader />
			<main className="flex-1 px-4 py-8 text-[#28213a] sm:px-6 sm:py-12">
			<div className="mx-auto w-full max-w-5xl">
				<header className="mb-7 flex flex-wrap items-end justify-between gap-4">
					<div>
						<p className="text-xs font-semibold uppercase text-[#6840c8]">จัดการอีเวนต์</p>
						<h1 className="mt-1 text-3xl font-semibold">สร้างรอบขาย</h1>
						<p className="mt-2 text-sm text-[#70697d]">ตั้งค่ารอบขาย ซัพพลายเออร์ สินค้า และค่าใช้จ่ายในขั้นตอนเดียว</p>
					</div>
					<p className="text-xs font-medium text-[#817a8f]">ขั้นตอน {currentStep + 1} จาก {steps.length}</p>
				</header>

				<div className="overflow-hidden border border-[#e5deef] bg-white shadow-[0_18px_60px_-42px_rgba(45,32,72,0.35)]">
					<StepProgress currentStep={currentStep} onSelect={setCurrentStep} />
					<div className="p-5 sm:p-8 md:p-10">
						{panels[currentStep]}
						<div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-[#eee9f5] pt-5 sm:flex-row">
							<button
								type="button"
								disabled={currentStep === 0}
								onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
								className="min-h-11 rounded-lg border border-[#d9d2e5] px-5 py-2.5 text-sm font-semibold text-[#514b60] transition-colors hover:bg-[#faf9fc] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]"
							>
								ย้อนกลับ
							</button>
							{currentStep < steps.length - 1 ? (
								<button
									type="button"
									onClick={goNext}
									disabled={currentStep === 0 && !runName.trim()}
									className="min-h-11 rounded-lg bg-[#6840c8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5633ac] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]"
								>
									ถัดไป <span aria-hidden="true">→</span>
								</button>
							) : (
								<button
									type="button"
									onClick={completeRun}
									className="min-h-11 rounded-lg bg-[#6840c8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5633ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]"
								>
									ยืนยันรอบขาย
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
			</main>
		</div>
	);
}
