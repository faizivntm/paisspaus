import { createFileRoute } from '@tanstack/react-router'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { ProjectCard } from '@/components/molecules/ProjectCard'
import { sortedProjects } from '@/content/projects'

export const Route = createFileRoute('/projects')({
  component: Projects,
})

function Projects() {
  const items = sortedProjects()

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <SectionHeading
        title="lets try"
        subtitle="Template & library open-source buatan saya. Silakan dipakai dan dibagikan."
      />

      {items.length === 0 ? (
        <p className="mt-10 text-mist">
          Belum ada karya. Tambahkan di src/content/projects.ts.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProjectCard key={p.repo} project={p} />
          ))}
        </div>
      )}
    </div>
  )
}
