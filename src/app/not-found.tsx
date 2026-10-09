import Link from "next/link";
import { Compass } from "lucide-react";
export default function NotFound() {
  return (
    <div className="empty-state">
      <span className="rocket-circle">
        <Compass size={27} />
      </span>
      <h1 className="text-2xl font-bold">Sepertinya kamu tersesat.</h1>
      <p>
        Halaman ini belum tersedia. Masih banyak ide menarik untuk dijelajahi.
      </p>
      <Link href="/" className="primary-button">
        Kembali ke feed
      </Link>
    </div>
  );
}
