import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { MaterialCard } from '@/components/molecules/MaterialCard'
import { useMaterials } from '@/api/materials/useMaterials'
import type { Material } from '@/content/materials'

export const Route = createFileRoute('/materials/')({
  component: Materials,
})

// Gabungkan semua teks yang bisa dicari dari satu materi (termasuk isi blok).
function searchableText(m: Material): string {
  const parts: string[] = [m.title, m.summary, m.category, ...(m.tags ?? [])]
  for (const b of m.body) {
    if (b.type === 'heading' || b.type === 'paragraph') parts.push(b.text)
    else if (b.type === 'list') parts.push(...b.items)
    else if (b.type === 'code') parts.push(b.code)
  }
  return parts.join(' ').toLowerCase()
}

function Materials() {
  const { data, isLoading, isError } = useMaterials()
  const [query, setQuery] = useState('')

  // Precompute indeks teks sekali per data (bukan tiap ketikan).
  const index = useMemo(
    () => (data ?? []).map((m) => ({ material: m, text: searchableText(m) })),
    [data],
  )

  const items = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (!terms.length) return data ?? []
    return index
      .filter(({ text }) => terms.every((t) => text.includes(t)))
      .map(({ material }) => material)
  }, [index, query, data])

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <SectionHeading
        title="Semua Materi"
        subtitle="Kumpulan catatan & pembelajaran untuk semua."
      />

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari judul, isi, kategori, atau tag…"
        className="mt-8 w-full max-w-md rounded-xl border border-line bg-tide/60 px-4 py-2.5 text-foam placeholder:text-mist outline-none transition-colors focus:border-surf/50"
      />

      {isLoading ? (
        <p className="mt-10 text-mist">Memuat materi…</p>
      ) : isError ? (
        <p className="mt-10 text-red-300">
          Gagal memuat materi. Pastikan server API aktif.
        </p>
      ) : items.length === 0 ? (
        <p className="mt-10 text-mist">
          {(data ?? []).length === 0
            ? 'Belum ada materi.'
            : `Tidak ada materi yang cocok dengan "${query}".`}
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <MaterialCard key={m.slug} material={m} />
          ))}
        </div>
      )}
    </div>
  )
}
