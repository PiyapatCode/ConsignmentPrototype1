import Link from "next/link";

export default function UnauthHeader() {
	return (
		<header className="border-b border-[#eee8f7] bg-white">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
				<Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6840c8]">
					<span className="grid size-9 place-items-center rounded-xl bg-[#f0eaff] text-base font-bold text-[#6840c8]">
						N
					</span>
					<span className="text-base font-semibold text-[#302447] sm:text-lg">
						Name website
					</span>
				</Link>

				<nav aria-label="Main navigation" className="flex items-center gap-2 sm:gap-5">
					
					<Link
						href="/auth/login"
						className="rounded-md px-2 py-2 text-sm font-medium text-[#625b70] transition-colors hover:text-[#6840c8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]"
					>
						Sign in
					</Link>
					<Link
						href="/auth/register"
						className="rounded-lg bg-[#6840c8] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5832b2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8] sm:px-4"
					>
						<span className="sm:hidden">Sign up</span>
						<span className="hidden sm:inline">Create account</span>
					</Link>
				</nav>
			</div>
		</header>
	);
}
