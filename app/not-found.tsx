import Link from "next/link";

export default function NotFound() {
    return (
        <main className="relative grid min-h-0 flex-1 place-items-center overflow-hidden bg-[#f6f4fa] px-4 py-12 text-[#28213a] sm:px-6">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_#e9e1f8_0%,_transparent_52%)]" />
            <section className="relative w-full max-w-lg border border-[#e5deef] bg-white px-6 py-10 text-center shadow-[0_20px_60px_-42px_rgba(45,32,72,0.35)] sm:px-10 sm:py-12">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f1eef8] text-xl font-bold text-[#6840c8]" aria-hidden="true">
                    ?
                </div>
                <p className="mt-6 text-xs font-semibold uppercase text-[#6840c8]">404 · ไม่พบหน้านี้</p>
                <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">ดูเหมือนลิงก์นี้จะไม่มีอยู่</h1>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#70697d]">
                    หน้าที่คุณกำลังหาอาจถูกย้าย หรือลิงก์อาจไม่ถูกต้อง ลองกลับไปยังหน้าหลักหรือรายการรอบขาย
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#6840c8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5633ac] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6840c8]">
                        กลับหน้าหลัก
                    </Link>
                   
                </div>
            </section>
        </main>
    );
}