export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Memuat halaman"
      className="feed-container pt-6 animate-pulse"
    >
      {[1, 2, 3].map((i) => (
        <div className="flex gap-3 py-5 border-b border-[#c2c6d74d]" key={i}>
          <div className="w-10 h-10 rounded-full bg-[#eaedff] shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-2/3 rounded bg-[#eaedff]" />
            <div className="h-3 w-1/2 rounded bg-[#eaedff]" />
            <div className="h-24 rounded-xl bg-[#f2f3ff]" />
          </div>
        </div>
      ))}
    </div>
  );
}
