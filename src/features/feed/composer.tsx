"use client";
import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { ImagePlus, Lightbulb, LoaderCircle, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useDatabase, useDatabaseMutation } from "@/lib/queries";
import { postInputSchema } from "@/lib/schemas";
import { useApp } from "@/providers/app-provider";
import { categories, type Category } from "@/types";
export function Composer({ onClose }: { onClose: () => void }) {
  const { data } = useDatabase();
  const mutation = useDatabaseMutation();
  const { notify } = useApp();
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Category>("Bisnis");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  async function submit(e: FormEvent) {
    e.preventDefault();
    const result = postInputSchema.safeParse({ text, category, images });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    try {
      await mutation.mutateAsync((db) => ({
        ...db,
        posts: [
          {
            ...result.data,
            id: crypto.randomUUID(),
            authorId: "me",
            createdAt: new Date().toISOString(),
            likes: 0,
            commentCount: 0,
            reposts: 0,
            liked: false,
            saved: false,
            reposted: false,
            comments: [],
          },
          ...db.posts,
        ],
      }));
      notify("Idemu berhasil dibagikan. Saatnya tumbuh bersama!");
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  }
  async function addImages(files: FileList | null) {
    if (!files) return;
    setError("");
    setUploading(true);
    try {
      const selected = [...files];
      if (images.length + selected.length > 3)
        throw new Error("Maksimal 3 gambar per posting.");
      const urls = await Promise.all(
        selected.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              if (
                !["image/jpeg", "image/png", "image/webp"].includes(
                  file.type,
                ) ||
                file.size > 2 * 1024 * 1024
              ) {
                reject(
                  new Error(
                    "Gunakan JPG, PNG, atau WebP dengan ukuran maksimal 2 MB.",
                  ),
                );
                return;
              }
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = () =>
                reject(new Error("Gambar tidak bisa dibaca."));
              reader.readAsDataURL(file);
            }),
        ),
      );
      setImages((old) => [...old, ...urls]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }
  return (
    <Dialog title="Bagikan ide, buka peluang" onClose={onClose}>
      <form className="composer-form" onSubmit={submit}>
        <div className="flex items-center gap-3">
          <Image
            className="avatar"
            src={data.profile.avatar}
            width={40}
            height={40}
            alt=""
          />
          <div>
            <strong>{data.profile.fullname}</strong>
            <p className="muted text-xs">
              {data.profile.position} @ {data.profile.company}
            </p>
          </div>
        </div>
        <label className="field-label" htmlFor="post-category">
          Apa yang ingin kamu bagikan?
        </label>
        <select
          id="post-category"
          className="form-input"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="post-text">
          Isi posting
        </label>
        <textarea
          id="post-text"
          className="composer-textarea"
          placeholder="Ceritakan produk, ide bisnis, atau peluang kolaborasimu…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1200}
          rows={6}
          required
        />
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="text-button"
            disabled={uploading || images.length === 3}
            onClick={() => fileRef.current?.click()}
          >
            <ImagePlus size={19} /> Tambah gambar
          </button>
          <span className="muted text-xs">{text.length}/1.200</span>
        </div>
        <input
          ref={fileRef}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => void addImages(e.target.files)}
          aria-label="Unggah gambar"
        />
        {images.length > 0 && (
          <div className="upload-previews">
            {images.map((src, i) => (
              <div key={src}>
                <Image
                  unoptimized
                  src={src}
                  alt={`Lampiran ${i + 1}`}
                  width={100}
                  height={100}
                />
                <button
                  type="button"
                  aria-label={`Hapus gambar ${i + 1}`}
                  onClick={() =>
                    setImages((old) => old.filter((_, n) => n !== i))
                  }
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="hint">
          <Lightbulb size={18} />
          <p>
            Ide sederhana bisa jadi awal sesuatu yang besar. Berbagi dengan
            jelas, berdiskusi dengan hangat.
          </p>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="primary-button w-full"
          disabled={mutation.isPending || uploading}
        >
          {mutation.isPending ? (
            <LoaderCircle className="animate-spin" size={18} />
          ) : null}
          Bagikan sekarang
        </button>
      </form>
    </Dialog>
  );
}
