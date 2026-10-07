'use client';
import UnauthHeader from "../../../components/layout/UnauthHeader";

export default function LoginPage() {
	return (
		<div className="flex min-h-0 flex-1 flex-col bg-[#f6f2ff]">
			<UnauthHeader />
			<main className="relative grid flex-1 place-items-center overflow-x-hidden px-4 py-8 text-[#211a35] sm:px-6 sm:py-10 md:py-12">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_#e4d8ff_0%,_transparent_48%)]"
				/>

				<section className="relative w-full max-w-md rounded-2xl border border-[#e9e2f5] bg-white px-5 py-7 shadow-[0_24px_80px_-40px_rgba(76,45,135,0.35)] sm:px-8 sm:py-9 md:px-10 md:py-10">
				<div className="mb-7 flex justify-center sm:mb-8">
					<div className="grid size-12 place-items-center rounded-2xl bg-[#f0eaff] text-xl font-bold text-[#6840c8]">
						N
					</div>
				</div>

				<div className="text-center">
					<p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#7652c7]">
						Welcome back
					</p>
					<h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#211a35] sm:text-3xl">
						Sign in to continue
					</h1>
					<p className="mt-3 text-sm leading-6 text-[#756f82]">
						Sign in with your account to get started.
					</p>
				</div>

				<form className="mt-8 space-y-4">
					<div>
						<label htmlFor="login-username" className="mb-1.5 block text-sm font-medium text-[#393249]">
							Username or email
						</label>
						<input
							id="login-username"
							name="username"
							autoComplete="username"
							required
							className="min-h-12 w-full rounded-xl border border-[#ddd6e9] bg-white px-4 text-sm text-[#211a35] outline-none transition focus:border-[#6840c8] focus:ring-3 focus:ring-[#6840c8]/15"
							placeholder="Enter your username or email"
						/>
					</div>
					<div>
						<label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-[#393249]">
							Password
						</label>
						<input
							id="login-password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							className="min-h-12 w-full rounded-xl border border-[#ddd6e9] bg-white px-4 text-sm text-[#211a35] outline-none transition focus:border-[#6840c8] focus:ring-3 focus:ring-[#6840c8]/15"
							placeholder="Enter your password"
						/>
					</div>
					<button
						type="submit"
						className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#6840c8] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5832b2] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#6840c8]"
					>
						Sign in
					</button>
				</form>

				<div className="my-6 flex items-center gap-3" aria-hidden="true">
					<div className="h-px flex-1 bg-[#eee9f5]" />
					<span className="text-xs font-medium uppercase text-[#9690a2]">or</span>
					<div className="h-px flex-1 bg-[#eee9f5]" />
				</div>

				<button
					type="button"
                    onClick={()=>window.location.href = "/sales-run"}
					className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#ddd6e9] bg-white px-5 py-3 text-sm font-semibold text-[#393249] transition-colors hover:bg-[#faf8fd] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#6840c8]"
				>
					<span
						aria-hidden="true"
						className="grid size-6 place-items-center rounded-full bg-white text-base font-bold text-[#4285f4]"
					>
						G
					</span>
					Sign in with Google
				</button>

				<p className="mt-7 text-center text-xs text-[#8b8598]">
					By continuing, you agree to our terms and privacy policy.
				</p>
				</section>
			</main>
		</div>
	);
}
