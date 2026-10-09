"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="empty-state">
      <h1 className="text-xl font-semibold">Halaman belum bisa dimuat.</h1>
      <p>Coba muat ulang untuk melanjutkan.</p>
      <button className="primary-button" onClick={reset}>
        Coba lagi
      </button>
    </div>
  );
}
