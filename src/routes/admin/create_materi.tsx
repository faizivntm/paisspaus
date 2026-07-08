import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { FaBookOpen, FaCode, FaPencil, FaPlus } from 'react-icons/fa6'
import { AdminTopbar } from '@/components/organisms/AdminTopbar'
import { FaEye, FaTrash } from 'react-icons/fa'

export const Route = createFileRoute('/admin/create_materi')({
  // Guard: tanpa token, lempar ke login.
  beforeLoad: () => {
    if (!localStorage.getItem('token')) {
      throw redirect({ to: '/admin/login' })
    }
  },
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="flex min-h-svh flex-col">
      <AdminTopbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <h1 className="text-3xl font-bold text-foam">Dashboard Admin</h1>
        <p className="mt-1 text-mist">Mau menambahkan apa hari ini? 🐋</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Buat Materi */}
          <Link
            to="/admin/materials/new"
            className="group rounded-2xl border border-line bg-tide/60 p-6 transition-colors hover:border-surf/50 hover:bg-tide"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surf/10 text-surf">
              <FaBookOpen className="h-5 w-5" />
            </div>
            <h2 className="mt-4 flex items-center gap-2 text-lg font-semibold text-foam group-hover:text-surf">
              Buat Materi <FaPlus className="h-3.5 w-3.5" />
            </h2>
            <p className="mt-1 text-sm text-mist">
              Susun catatan atau materi belajar blok demi blok, lengkap dengan
              pratinjau.
            </p>
          </Link>

           {/* Buat Karya (belum) */}
           <div className="rounded-2xl border border-line bg-tide/30 p-6 opacity-60">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-mist">
              <FaBookOpen className="h-5 w-5" />
            </div>
            <h2 className="mt-4 flex items-center gap-2 text-lg font-semibold text-foam">
              Edit Materi <FaPencil className="h-3.5 w-3.5" />
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-mist">
                Segera
              </span>
            </h2>
            <p className="mt-1 text-sm text-mist">
              Tambah repository/template ke halaman Karya.
            </p>
          </div>

          {/* Buat Karya (belum) */}
          <div className="rounded-2xl border border-line bg-tide/30 p-6 opacity-60">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-mist">
              <FaBookOpen className="h-5 w-5" />
            </div>
            <h2 className="mt-4 flex items-center gap-2 text-lg font-semibold text-foam">
              Check List Materi <FaEye className="h-3.5 w-3.5" /> <FaTrash className="h-3.5 w-3.5" />
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-mist">
                Segera
              </span>
            </h2>
            <p className="mt-1 text-sm text-mist">
              Tambah repository/template ke halaman Karya.
            </p>
          </div>

          {/* Buat Karya (belum) */}
          <div className="rounded-2xl border border-line bg-tide/30 p-6 opacity-60">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-mist">
              <FaCode className="h-5 w-5" />
            </div>
            <h2 className="mt-4 flex items-center gap-2 text-lg font-semibold text-foam">
              Create Project <FaPlus className="h-3.5 w-3.5" />
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-mist">
                Segera
              </span>
            </h2>
            <p className="mt-1 text-sm text-mist">
              Tambah repository/template ke halaman Karya.
            </p>
          </div>

          {/* Buat Karya (belum) */}
          <div className="rounded-2xl border border-line bg-tide/30 p-6 opacity-60">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-mist">
              <FaCode className="h-5 w-5" />
            </div>
            <h2 className="mt-4 flex items-center gap-2 text-lg font-semibold text-foam">
              Edit Project <FaPencil className="h-3.5 w-3.5" />
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-mist">
                Segera
              </span>
            </h2>
            <p className="mt-1 text-sm text-mist">
              Tambah repository/template ke halaman Karya.
            </p>
          </div>

          {/* Buat Karya (belum) */}
          <div className="rounded-2xl border border-line bg-tide/30 p-6 opacity-60">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-mist">
              <FaCode className="h-5 w-5" />
            </div>
            <h2 className="mt-4 flex items-center gap-2 text-lg font-semibold text-foam">
              Check Project <FaEye className="h-3.5 w-3.5" /> <FaTrash className="h-3.5 w-3.5" />
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-mist">
                Segera
              </span>
            </h2>
            <p className="mt-1 text-sm text-mist">
              Tambah repository/template ke halaman Karya.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
