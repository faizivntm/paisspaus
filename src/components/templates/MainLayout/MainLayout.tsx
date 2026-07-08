import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'

// Template: kerangka halaman (header + area konten + footer).
// Halaman /admin (login dll) tampil polos tanpa header/footer.
export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const bare = pathname.startsWith('/admin')

  if (bare) {
    return <main className="flex min-h-svh flex-col">{children}</main>
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  )
}
