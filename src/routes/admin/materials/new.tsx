import { useRef, useState } from 'react'
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowUp,
  FaCheck,
  FaPlus,
  FaTrash,
} from 'react-icons/fa6'
import { Button } from '@/components/atoms/Button'
import { AdminTopbar } from '@/components/organisms/AdminTopbar'
import { ContentBlocks } from '@/components/organisms/ContentBlocks'
import { createMaterial } from '@/api/materials/createMaterial'
import type { Block, Material } from '@/content/materials'

export const Route = createFileRoute('/admin/materials/new')({
  beforeLoad: () => {
    if (!localStorage.getItem('token')) {
      throw redirect({ to: '/admin/login' })
    }
  },
  component: NewMaterial,
})

// Blok versi editor: 'list' & 'code' simpan teks mentah biar gampang diketik.
type EditorBlock =
  | { id: number; type: 'heading'; text: string }
  | { id: number; type: 'paragraph'; text: string }
  | { id: number; type: 'list'; itemsText: string }
  | { id: number; type: 'code'; lang: string; code: string }

const BLOCK_LABEL: Record<EditorBlock['type'], string> = {
  heading: 'Sub-judul',
  paragraph: 'Paragraf',
  list: 'Daftar',
  code: 'Kode',
}

const field =
  'w-full rounded-lg border border-line bg-abyss/50 px-3 py-2 text-sm text-foam placeholder:text-mist outline-none transition-colors focus:border-surf/60'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// EditorBlock[] -> Block[] (bentuk final yang dikirim ke API), buang blok kosong.
function toBlocks(blocks: EditorBlock[]): Block[] {
  const result: Block[] = []
  for (const b of blocks) {
    if (b.type === 'list') {
      const items = b.itemsText.split('\n').map((s) => s.trim()).filter(Boolean)
      if (items.length) result.push({ type: 'list', items })
    } else if (b.type === 'code') {
      if (b.code.trim()) result.push({ type: 'code', lang: b.lang || undefined, code: b.code })
    } else if (b.text.trim()) {
      result.push({ type: b.type, text: b.text })
    }
  }
  return result
}

const today = new Date().toISOString().slice(0, 10)

function NewMaterial() {
  const navigate = useNavigate()
  const idRef = useRef(2)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(today)
  const [tagsInput, setTagsInput] = useState('')
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    { id: 1, type: 'heading', text: '' },
    { id: 2, type: 'paragraph', text: '' },
  ])

  const onTitle = (v: string) => {
    setTitle(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  const addBlock = (type: EditorBlock['type']) => {
    const id = ++idRef.current
    const base =
      type === 'list'
        ? { id, type, itemsText: '' }
        : type === 'code'
          ? { id, type, lang: '', code: '' }
          : { id, type, text: '' }
    setBlocks((prev) => [...prev, base as EditorBlock])
  }

  const update = (id: number, patch: Partial<EditorBlock>) =>
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? ({ ...b, ...patch } as EditorBlock) : b)),
    )

  const remove = (id: number) =>
    setBlocks((prev) => prev.filter((b) => b.id !== id))

  const move = (i: number, dir: -1 | 1) =>
    setBlocks((prev) => {
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })

  const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
  const body = toBlocks(blocks)

  const material: Material = {
    slug,
    title,
    summary,
    category,
    date,
    ...(tags.length ? { tags } : {}),
    body,
  }

  const queryClient = useQueryClient()
  const save = useMutation({
    mutationFn: createMaterial,
    // Segarkan daftar materi publik supaya yang baru langsung muncul.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['materials'] }),
  })

  const resetForm = () => {
    idRef.current = 2
    setTitle('')
    setSlug('')
    setSlugTouched(false)
    setSummary('')
    setCategory('')
    setDate(today)
    setTagsInput('')
    setBlocks([
      { id: 1, type: 'heading', text: '' },
      { id: 2, type: 'paragraph', text: '' },
    ])
    save.reset()
  }

  const canSubmit =
    Boolean(slug && title && summary && category) && body.length > 0

  return (
    <div className="flex min-h-svh flex-col">
      <AdminTopbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Link
          to="/admin/create_materi"
          className="inline-flex items-center gap-1.5 text-sm text-surf hover:underline"
        >
          <FaArrowLeft className="h-3 w-3" /> Dashboard
        </Link>

        <div className="mb-8 mt-4">
          <h1 className="text-2xl font-bold text-foam">Buat Materi</h1>
          <p className="mt-1 text-sm text-mist">
            Susun materinya blok demi blok, lihat pratinjaunya, lalu simpan.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ── Editor ── */}
          <div className="flex min-w-0 flex-col gap-5">
            <section className="rounded-xl border border-line bg-tide/40 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-mist">
                Informasi
              </h2>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1.5 text-sm text-mist">
                  Judul
                  <input
                    className={field}
                    value={title}
                    onChange={(e) => onTitle(e.target.value)}
                    placeholder="mis. Pengenalan Java"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm text-mist">
                  Slug (URL)
                  <input
                    className={field}
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true)
                      setSlug(e.target.value)
                    }}
                    placeholder="pengenalan-java"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm text-mist">
                  Ringkasan
                  <textarea
                    className={`${field} min-h-20 resize-y`}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="1–2 kalimat, muncul di kartu."
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-sm text-mist">
                    Kategori
                    <input
                      className={field}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Java"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm text-mist">
                    Tanggal
                    <input
                      type="date"
                      className={field}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5 text-sm text-mist">
                  Tags (pisahkan dengan koma)
                  <input
                    className={field}
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="java, dasar, oop"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-xl border border-line bg-tide/40 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-mist">
                Isi materi
              </h2>

              <div className="flex flex-col gap-4">
                {blocks.map((b, i) => (
                  <div
                    key={b.id}
                    className="rounded-lg border border-line bg-abyss/30 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-md bg-surf/10 px-2 py-0.5 text-xs font-medium text-surf">
                        {BLOCK_LABEL[b.type]}
                      </span>
                      <div className="flex items-center gap-1 text-mist">
                        <button
                          type="button"
                          onClick={() => move(i, -1)}
                          disabled={i === 0}
                          aria-label="Naikkan"
                          className="rounded p-1.5 hover:bg-white/5 disabled:opacity-30"
                        >
                          <FaArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(i, 1)}
                          disabled={i === blocks.length - 1}
                          aria-label="Turunkan"
                          className="rounded p-1.5 hover:bg-white/5 disabled:opacity-30"
                        >
                          <FaArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(b.id)}
                          aria-label="Hapus blok"
                          className="rounded p-1.5 text-red-400 hover:bg-red-500/10"
                        >
                          <FaTrash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {b.type === 'heading' && (
                      <input
                        className={field}
                        value={b.text}
                        onChange={(e) => update(b.id, { text: e.target.value })}
                        placeholder="Teks sub-judul"
                      />
                    )}
                    {b.type === 'paragraph' && (
                      <textarea
                        className={`${field} min-h-24 resize-y`}
                        value={b.text}
                        onChange={(e) => update(b.id, { text: e.target.value })}
                        placeholder="Tulis paragrafmu di sini..."
                      />
                    )}
                    {b.type === 'list' && (
                      <textarea
                        className={`${field} min-h-24 resize-y`}
                        value={b.itemsText}
                        onChange={(e) => update(b.id, { itemsText: e.target.value })}
                        placeholder={'Satu poin per baris\nPoin kedua\nPoin ketiga'}
                      />
                    )}
                    {b.type === 'code' && (
                      <div className="flex flex-col gap-2">
                        <input
                          className={field}
                          value={b.lang}
                          onChange={(e) => update(b.id, { lang: e.target.value })}
                          placeholder="bahasa (mis. java, ts, bash)"
                        />
                        <textarea
                          className={`${field} min-h-28 resize-y font-mono`}
                          value={b.code}
                          onChange={(e) => update(b.id, { code: e.target.value })}
                          placeholder={'System.out.println("Halo");'}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(['heading', 'paragraph', 'list', 'code'] as const).map((t) => (
                  <Button
                    key={t}
                    variant="ghost"
                    onClick={() => addBlock(t)}
                    className="gap-1.5 px-3 py-1.5 text-xs"
                  >
                    <FaPlus className="h-3 w-3" /> {BLOCK_LABEL[t]}
                  </Button>
                ))}
              </div>
            </section>
          </div>

          {/* ── Preview + simpan ── */}
          <div className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-xl border border-line bg-tide/40 p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-mist">
                Pratinjau
              </h2>
              <article>
                <div className="flex items-center gap-3 text-xs text-mist">
                  {category && (
                    <span className="rounded-full bg-surf/10 px-2.5 py-1 font-medium text-surf">
                      {category}
                    </span>
                  )}
                  <span>{date}</span>
                </div>
                <h1 className="mt-3 break-words text-3xl font-bold tracking-tight text-foam">
                  {title || 'Judul materi'}
                </h1>
                {summary && (
                  <p className="mt-2 break-words text-lg text-mist">{summary}</p>
                )}
                <div className="mt-6">
                  <ContentBlocks blocks={body} />
                </div>
              </article>
            </section>

            <section className="rounded-xl border border-line bg-tide/40 p-5">
              {save.isError && (
                <p className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {save.error.message}
                </p>
              )}
              <Button
                onClick={() => save.mutate(material)}
                disabled={!canSubmit || save.isPending}
                className="w-full"
              >
                {save.isPending ? 'Menyimpan...' : 'Simpan Materi'}
              </Button>
              {!canSubmit && (
                <p className="mt-2 text-center text-xs text-mist">
                  Isi judul, slug, ringkasan, kategori, dan minimal satu blok.
                </p>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Overlay loading */}
      {save.isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-surf border-t-transparent" />
            <p className="text-sm text-mist">Menyimpan materi…</p>
          </div>
        </div>
      )}

      {/* Modal sukses */}
      {save.isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-deep p-6 text-center shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15 text-green-400">
              <FaCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foam">Materi tersimpan!</h3>
            <p className="mt-1 break-words text-sm text-mist">
              "{save.data?.title ?? title}" berhasil disimpan ke database.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={resetForm}>
                Buat Lagi
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate({ to: '/admin/create_materi' })}
              >
                Ke Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
