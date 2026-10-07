export type StaffRole = "pending" | "ผู้จัดการ" | "พนักงานขาย" | "ดูข้อมูล";

export type StaffInvite = {
	id: string;
	runId: string;
	name: string;
	username: string;
	role: StaffRole;
	canEndSalesRun: boolean;
	createdAt: string;
};

export type AddStaffInviteResult =
	| { ok: true; invite: StaffInvite; existing: boolean }
	| { ok: false; reason: "duplicate" | "storage" };

const STORAGE_KEY = "artshare.staff-invites";
const CHANGE_EVENT = "artshare.staff-invites.changed";
const EMPTY_INVITES: StaffInvite[] = [];
let cachedStorageValue: string | null | undefined;
let cachedInvites: StaffInvite[] = EMPTY_INVITES;

function isStaffInvite(value: unknown): value is StaffInvite {
	if (!value || typeof value !== "object") return false;
	const invite = value as Partial<StaffInvite>;
	return typeof invite.id === "string"
		&& typeof invite.runId === "string"
		&& typeof invite.name === "string"
		&& (invite.username === undefined || typeof invite.username === "string")
		&& (invite.role === "pending" || invite.role === "ผู้จัดการ" || invite.role === "พนักงานขาย" || invite.role === "ดูข้อมูล")
		&& typeof invite.createdAt === "string"
		&& (invite.canEndSalesRun === undefined || typeof invite.canEndSalesRun === "boolean");
}

export function getStaffInvitesSnapshot(): StaffInvite[] {
	if (typeof window === "undefined") return EMPTY_INVITES;
	let value: string | null;
	try {
		value = window.localStorage.getItem(STORAGE_KEY);
	} catch {
		return EMPTY_INVITES;
	}
	if (value === cachedStorageValue) return cachedInvites;
	cachedStorageValue = value;
	try {
		const parsed: unknown = JSON.parse(value ?? "[]");
		cachedInvites = Array.isArray(parsed) 
			? parsed.filter(isStaffInvite).map((invite) => ({ ...invite, username: invite.username?.trim() || invite.name.trim(), canEndSalesRun: invite.canEndSalesRun ?? false }))
			: EMPTY_INVITES;
	} catch {
		cachedInvites = EMPTY_INVITES;
	}
	return cachedInvites;
}

export function getServerStaffInvitesSnapshot(): StaffInvite[] {
	return EMPTY_INVITES;
}

export function subscribeToStaffInvites(onChange: () => void): () => void {
	if (typeof window === "undefined") return () => undefined;
	window.addEventListener("storage", onChange);
	window.addEventListener(CHANGE_EVENT, onChange);
	return () => {
		window.removeEventListener("storage", onChange);
		window.removeEventListener(CHANGE_EVENT, onChange);
	};
}

function notifyChanged() {
	cachedStorageValue = undefined;
	window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function addPendingStaffInvite(runId: string, name: string, username: string): AddStaffInviteResult {
	if (typeof window === "undefined") return { ok: false, reason: "storage" };
	const normalizedUsername = username.trim().toLocaleLowerCase("en-US");
	const existingInvites = getStaffInvitesSnapshot().filter((invite) => invite.runId === runId);
	const existingInvite = existingInvites.find((invite) => invite.username.trim().toLocaleLowerCase("en-US") === normalizedUsername);
	if (existingInvite) {
		const sameDisplayName = existingInvite.name.trim().toLocaleLowerCase("en-US") === name.trim().toLocaleLowerCase("en-US");
		return sameDisplayName ? { ok: true, invite: existingInvite, existing: true } : { ok: false, reason: "duplicate" };
	}
	const invite: StaffInvite = {
		id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
		runId,
		name,
		username: username.trim(),
		role: "pending",
		canEndSalesRun: false,
		createdAt: new Date().toISOString(),
	};
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify([invite, ...getStaffInvitesSnapshot()]));
		notifyChanged();
		return { ok: true, invite, existing: false };
	} catch {
		return { ok: false, reason: "storage" };
	}
}

export function recognizeDemoStaffMember(runId: string, name: string, username: string): StaffInvite | null {
	if (typeof window === "undefined") return null;
	const demoMembers: { username: string; name: string; role: Exclude<StaffRole, "pending"> }[] = [
		{ username: "nicha", name: "Nicha S.", role: "ผู้จัดการ" },
		{ username: "ploy", name: "Ploy K.", role: "พนักงานขาย" },
		{ username: "ton", name: "Ton A.", role: "ดูข้อมูล" },
	];
	const member = demoMembers.find((candidate) => candidate.username === username.trim().toLocaleLowerCase("en-US")
		&& candidate.name.toLocaleLowerCase("en-US") === name.trim().toLocaleLowerCase("en-US"));
	if (!member) return null;
	const invite: StaffInvite = {
		id: `demo-${runId}-${member.username}`,
		runId,
		name: member.name,
		username: member.username,
		role: member.role,
		canEndSalesRun: false,
		createdAt: new Date().toISOString(),
	};
	try {
		const invites = getStaffInvitesSnapshot();
		const existing = invites.find((item) => item.runId === runId && item.username.toLocaleLowerCase("en-US") === member.username);
		if (existing) return existing.name.toLocaleLowerCase("en-US") === member.name.toLocaleLowerCase("en-US") ? existing : null;
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify([invite, ...invites]));
		notifyChanged();
		return invite;
	} catch {
		return null;
	}
}

export function updateStaffInviteRole(id: string, role: Exclude<StaffRole, "pending">): void {
	if (typeof window === "undefined") return;
	try {
		const invites = getStaffInvitesSnapshot().map((invite) => invite.id === id ? { ...invite, role } : invite);
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invites));
		notifyChanged();
	} catch {
		return;
	}
}

export function updateStaffInviteEndPermission(id: string, canEndSalesRun: boolean): void {
	if (typeof window === "undefined") return;
	try {
		const invites = getStaffInvitesSnapshot().map((invite) => invite.id === id ? { ...invite, canEndSalesRun } : invite);
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invites));
		notifyChanged();
	} catch {
		return;
	}
}
