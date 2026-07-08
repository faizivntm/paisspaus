import { createFileRoute, Link } from '@tanstack/react-router'
import { ContentBlocks } from '@/components/organisms/ContentBlocks'
import { useMaterials } from '@/api/materials/useMaterials'
import { formatDate } from '@/lib/utils'

export const Route = createFileRoute('/materials/$slug')({
  component: MaterialDetail,
})

function MaterialDetail() {
  const { slug } = Route.useParams()
  const { data, isLoading, isError } = useMaterials()

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-24 text-center text-mist">
        Memuat materi…
      </div>
    )
  }

  const material = data?.find((m) => m.slug === slug)

  if (isError || !material) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
        <p className="text-mist">
          {isError ? 'Gagal memuat materi.' : 'Materi tidak ditemukan.'}
        </p>
        <Link to="/materials" className="mt-4 inline-block text-surf">
          ← Kembali ke semua materi
        </Link>
      </div>
    )
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16">
      <Link to="/materials" className="text-sm text-surf hover:underline">
        ← Semua materi
      </Link>

      <header className="mt-6 border-b border-line pb-6">
        <div className="flex items-center gap-3 text-xs text-mist">
          <span className="rounded-full bg-surf/10 px-2.5 py-1 font-medium text-surf">
            {material.category}
          </span>
          <time dateTime={material.date}>{formatDate(material.date)}</time>
        </div>
        <h1 className="mt-4 break-words text-3xl font-bold tracking-tight text-foam">
          {material.title}
        </h1>
        <p className="mt-2 break-words text-lg text-mist">{material.summary}</p>
        {material.tags && material.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {material.tags.map((tag) => (
              <span key={tag} className="text-xs text-mist">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="mt-8">
        <ContentBlocks blocks={material.body} />
      </div>
    </article>
  )
}
