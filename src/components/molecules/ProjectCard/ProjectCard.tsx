import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { Button } from '@/components/atoms/Button'
import type { Project } from '@/content/projects'
import { formatDate } from '@/lib/utils'

// Molecule: kartu satu karya/repository, dengan tombol Bagikan.
export function ProjectCard({ project }: { project: Project }) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const data = { title: project.title, text: project.description, url: project.repo }
    // Web Share API (native, muncul share sheet di HP). Kalau tak ada, salin link.
    if (navigator.share) {
      try {
        await navigator.share(data)
      } catch {
        // user membatalkan — abaikan
      }
      return
    }
    try {
      await navigator.clipboard.writeText(project.repo)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard diblokir — abaikan
    }
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-line bg-tide/60 p-5">
      <div className="flex items-center justify-between text-xs text-mist">
        {project.category && (
          <span className="rounded-full bg-surf/10 px-2.5 py-1 font-medium text-surf">
            {project.category}
          </span>
        )}
        {project.date && <time dateTime={project.date}>{formatDate(project.date)}</time>}
      </div>

      <h3 className="mt-3 text-lg font-semibold text-foam">{project.title}</h3>
      <p className="mt-1 text-sm text-mist">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span key={t} className="rounded-md border border-line px-2 py-0.5 text-xs text-mist">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-3 pt-5">
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-surf px-4 py-2.5 text-sm font-semibold text-abyss transition-colors hover:bg-surf-deep hover:text-foam"
        >
          <FaGithub className="h-4 w-4" /> Kunjungi
        </a>
        <Button variant="secondary" onClick={share}>
          {copied ? 'Link tersalin!' : 'Bagikan'}
        </Button>
      </div>
    </div>
  )
}
