export type SalesRunStatus = "ongoing" | "ended";

export type SalesRunRecord = {
	id: string;
	name: string;
	date: string;
	status: SalesRunStatus;
	supplierCount: number;
	productCount: number;
	expenseTotal: number;
	createdAt: string;
};

export const SALES_RUNS_STORAGE_KEY = "artshare.sales-runs";
const CHANGE_EVENT = "artshare.sales-runs.changed";
const EMPTY_RUNS: SalesRunRecord[] = [];
const MOCK_SALES_RUNS: SalesRunRecord[] = [
	{
		id: "mock-art-market-oct-2026",
		name: "Art Market เดือนตุลาคม",
		date: "2026-10-12",
		status: "ongoing",
		supplierCount: 8,
		productCount: 42,
		expenseTotal: 1850,
		createdAt: "2026-10-01T09:00:00.000Z",
	},
	{
		id: "mock-comic-avenue-sep-2026",
		name: "Comic Avenue Mini Booth",
		date: "2026-09-21",
		status: "ended",
		supplierCount: 5,
		productCount: 27,
		expenseTotal: 2400,
		createdAt: "2026-09-02T04:30:00.000Z",
	},
	{
		id: "mock-creator-weekend-aug-2026",
		name: "Creator Weekend: Art & Toy",
		date: "2026-08-16",
		status: "ended",
		supplierCount: 12,
		productCount: 68,
		expenseTotal: 3200,
		createdAt: "2026-08-01T03:15:00.000Z",
	},
];
let cachedStorageValue: string | null | undefined;
let cachedRuns: SalesRunRecord[] = EMPTY_RUNS;

function isSalesRunRecord(value: unknown): value is SalesRunRecord {
	if (!value || typeof value !== "object") return false;
	const record = value as Partial<SalesRunRecord>;
	return typeof record.id === "string"
		&& typeof record.name === "string"
		&& typeof record.date === "string"
		&& (record.status === "ongoing" || record.status === "ended")
		&& typeof record.supplierCount === "number"
		&& typeof record.productCount === "number"
		&& typeof record.expenseTotal === "number"
		&& typeof record.createdAt === "string";
}

export function readSalesRuns(): SalesRunRecord[] {
	if (typeof window === "undefined") return [];
	try {
		const value: unknown = JSON.parse(window.localStorage.getItem(SALES_RUNS_STORAGE_KEY) ?? "[]");
		return Array.isArray(value) ? value.filter(isSalesRunRecord) : [];
	} catch {
		return [];
	}
}

export function getSalesRunsSnapshot(): SalesRunRecord[] {
	if (typeof window === "undefined") return EMPTY_RUNS;
	let storedValue: string | null;
	try {
		storedValue = window.localStorage.getItem(SALES_RUNS_STORAGE_KEY);
	} catch {
		return EMPTY_RUNS;
	}
	if (storedValue === cachedStorageValue) return cachedRuns;
	cachedStorageValue = storedValue;
	try {
		const value: unknown = JSON.parse(storedValue ?? "[]");
		const savedRuns = Array.isArray(value) ? value.filter(isSalesRunRecord) : EMPTY_RUNS;
		cachedRuns = savedRuns.length > 0 ? savedRuns : MOCK_SALES_RUNS;
	} catch {
		cachedRuns = MOCK_SALES_RUNS;
	}
	return cachedRuns;
}

export function getServerSalesRunsSnapshot(): SalesRunRecord[] {
	return EMPTY_RUNS;
}

export function subscribeToSalesRuns(onChange: () => void): () => void {
	if (typeof window === "undefined") return () => undefined;
	window.addEventListener("storage", onChange);
	window.addEventListener(CHANGE_EVENT, onChange);
	return () => {
		window.removeEventListener("storage", onChange);
		window.removeEventListener(CHANGE_EVENT, onChange);
	};
}

function notifySalesRunsChanged() {
	cachedStorageValue = undefined;
	window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function saveSalesRun(record: SalesRunRecord): boolean {
	if (typeof window === "undefined") return false;
	try {
		window.localStorage.setItem(SALES_RUNS_STORAGE_KEY, JSON.stringify([record, ...readSalesRuns()]));
		notifySalesRunsChanged();
		return true;
	} catch {
		return false;
	}
}

export function updateSalesRunStatus(id: string, status: SalesRunStatus): void {
	if (typeof window === "undefined") return;
	try {
		const runs = getSalesRunsSnapshot().map((run) => run.id === id ? { ...run, status } : run);
		window.localStorage.setItem(SALES_RUNS_STORAGE_KEY, JSON.stringify(runs));
		notifySalesRunsChanged();
	} catch {
		return;
	}
}
