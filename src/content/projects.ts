// ┌─────────────────────────────────────────────────────────────────┐
// │  DAFTAR KARYA / REPOSITORY DI SINI. Edit array `projects` di bawah.│
// │  Halaman /projects baca dari sini. Tambah entry = tinggal duplikat.│
// └─────────────────────────────────────────────────────────────────┘

export interface Project {
  title: string
  description: string // 1–2 kalimat, muncul di kartu
  repo: string // URL GitHub (atау tautan lain)
  tech: string[] // label tech stack, mis. ["FastAPI", "Python"]
  category?: string // mis. "Template", "Library", "Tools"
  date?: string // format ISO: "2026-07-08" (buat urutan)
}

export const projects: Project[] = [
  {
    title: 'FastAPI Clean Architecture Template',
    description:
      'Starter FastAPI production-ready dengan arsitektur modular per-fitur (router → service → repository): SQL Server via pymssql, JWT auth, Docker, structured logging, dan scaffolder project satu perintah.',
    repo: 'https://github.com/faizivntm/fastapi-tamplate-by-faiz',
    tech: ['FastAPI', 'Python', 'SQL Server', 'JWT', 'Docker', 'Pydantic'],
    category: 'Template',
    date: '2026-07-08',
  },
]

// Karya terbaru dulu.
export const sortedProjects = () =>
  [...projects].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
