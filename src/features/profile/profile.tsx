"use client";
import { useCallback, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  Check,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Send,
  UserPlus,
  Globe,
} from "lucide-react";
import { useDatabase, useDatabaseMutation } from "@/lib/queries";
import { getUser } from "@/lib/seed";
import { userSchema } from "@/lib/schemas";
import { useApp } from "@/providers/app-provider";
import { Dialog } from "@/components/ui/dialog";
import { PostCard } from "@/features/feed/post-card";
import type { User } from "@/types";
function EditProfile({
  profile,
  onClose,
}: {
  profile: User;
  onClose: () => void;
}) {
  const [form, setForm] = useState(profile);
  const [error, setError] = useState("");
  const mutation = useDatabaseMutation();
  const { notify } = useApp();
  const fields: { key: keyof User; label: string; type?: string }[] = [
    { key: "fullname", label: "Nama lengkap" },
    { key: "phone", label: "Nomor HP", type: "tel" },
    { key: "email", label: "Email", type: "email" },
    { key: "position", label: "Jabatan" },
    { key: "company", label: "Nama perusahaan" },
    { key: "address", label: "Alamat" },
    { key: "website", label: "Website (opsional)", type: "url" },
  ];
  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = userSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    try {
      await mutation.mutateAsync((db) => ({ ...db, profile: parsed.data }));
      notify("Profil berhasil diperbarui.");
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  }
  return (
    <Dialog title="Edit profil bisnis" onClose={onClose}>
      <form onSubmit={submit} className="profile-form">
        <p className="muted text-sm">
          Bantu orang lain mengenal kamu dan usahamu.
        </p>
        {fields.map((f) => (
          <label key={f.key} className="field-label">
            {f.label}
            <input
              className="form-input"
              type={f.type || "text"}
              required={f.key !== "website"}
              value={form[f.key]}
              maxLength={f.key === "address" ? 200 : 100}
              onChange={(e) =>
                setForm((old) => ({ ...old, [f.key]: e.target.value }))
              }
            />
          </label>
        ))}
        <label className="field-label">
          Tentang kamu
          <textarea
            className="form-input"
            rows={3}
            value={form.bio}
            maxLength={240}
            onChange={(e) =>
              setForm((old) => ({ ...old, bio: e.target.value }))
            }
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button disabled={mutation.isPending} className="primary-button">
          {mutation.isPending ? "Menyimpan…" : "Simpan perubahan"}
        </button>
      </form>
    </Dialog>
  );
}
export function Profile({ userId = "me" }: { userId?: string }) {
  const { data } = useDatabase();
  const mutation = useDatabaseMutation();
  const { notify, openComposer } = useApp();
  const [edit, setEdit] = useState(false);
  const closeEdit = useCallback(() => setEdit(false), []);
  const mine = userId === "me";
  const user = getUser(userId, data.profile);
  const following = data.following.includes(user.id);
  const posts = data.posts.filter(
    (p) => p.authorId === user.id || (mine && p.reposted),
  );
  async function follow() {
    try {
      await mutation.mutateAsync((db) => ({
        ...db,
        following: db.following.includes(user.id)
          ? db.following.filter((id) => id !== user.id)
          : [...db.following, user.id],
      }));
      notify(
        following
          ? `Berhenti mengikuti ${user.fullname}.`
          : `Sekarang kamu mengikuti ${user.fullname}.`,
      );
    } catch (err) {
      notify((err as Error).message, true);
    }
  }
  return (
    <div className="feed-container">
      <div className="page-heading">
        <Link
          href={mine ? "/" : "/explore"}
          className="icon-button"
          aria-label="Kembali"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1>{mine ? "Profil saya" : "Profil bisnis"}</h1>
        {mine && (
          <Link
            href="/saved"
            className="icon-button ml-auto"
            aria-label="Posting tersimpan"
          >
            <Bookmark size={21} />
          </Link>
        )}
      </div>
      <div className="profile-cover">
        <span>Ide baik tumbuh bersama.</span>
        <div className="cover-orbit" />
      </div>
      <section className="profile-info">
        <div className="profile-top">
          <Image
            src={user.avatar}
            alt={user.fullname}
            className="profile-avatar"
            width={80}
            height={80}
          />
          {mine ? (
            <button className="secondary-button" onClick={() => setEdit(true)}>
              <Pencil size={15} />
              Edit profil
            </button>
          ) : (
            <button
              className={following ? "secondary-button" : "primary-button"}
              onClick={() => void follow()}
              disabled={mutation.isPending}
            >
              {following ? <Check size={16} /> : <UserPlus size={16} />}
              {following ? "Mengikuti" : "Ikuti"}
            </button>
          )}
        </div>
        <h2>{user.fullname}</h2>
        <p className="profile-position">
          <BriefcaseBusiness size={16} />
          {user.position} @ {user.company}
        </p>
        <p className="profile-bio">{user.bio}</p>
        <div className="profile-details">
          <span>
            <MapPin size={16} />
            {user.address}
          </span>
          {user.website && (
            <a href={user.website} target="_blank" rel="noopener noreferrer">
              <Globe size={16} />
              {user.website.replace(/^https?:\/\//, "")}
              <ArrowUpRight size={13} />
            </a>
          )}
          {mine && (
            <>
              <a href={`mailto:${user.email}`}>
                <Mail size={16} />
                {user.email}
              </a>
              <a href={`tel:${user.phone.replaceAll(" ", "")}`}>
                <Phone size={16} />
                {user.phone}
              </a>
            </>
          )}
        </div>
        {!mine && user.id !== "official" && (
          <Link
            href={`/messages/${user.id}`}
            className="secondary-button mt-5 w-full"
          >
            <Send size={17} />
            Mulai percakapan
          </Link>
        )}
        <div className="profile-stats">
          <div>
            <strong>{posts.length}</strong>
            <span>Posting</span>
          </div>
          {mine && (
            <>
              <div>
                <strong>{data.following.length}</strong>
                <span>Mengikuti</span>
              </div>
              <Link href="/saved">
                <strong>{data.posts.filter((p) => p.saved).length}</strong>
                <span>Tersimpan</span>
              </Link>
            </>
          )}
        </div>
      </section>
      <div className="section-title">
        <h2>{mine ? "Posting & bagikan ulang" : "Ide & cerita bisnis"}</h2>
      </div>
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
      {posts.length === 0 && (
        <div className="empty-state">
          <BriefcaseBusiness size={32} />
          <h2>Setiap perjalanan dimulai dari ide.</h2>
          <p>Bagikan produk, usaha, atau peluang pertamamu.</p>
          {mine && (
            <button className="primary-button" onClick={openComposer}>
              Bagikan ide pertama
            </button>
          )}
        </div>
      )}
      {edit && <EditProfile profile={data.profile} onClose={closeEdit} />}
    </div>
  );
}
