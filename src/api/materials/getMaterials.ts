import { apiFetch } from '@/api/client'
import type { Material } from '@/content/materials'

// Ambil semua materi dari backend (sudah urut terbaru dari server).
export function getMaterials() {
  return apiFetch<Material[]>('/materials')
}
