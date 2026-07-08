import { apiFetch } from '@/api/client'
import type { Material } from '@/content/materials'

// Kirim materi baru ke backend. Token auth otomatis dilampirkan oleh client.
export function createMaterial(material: Material) {
  return apiFetch<Material>('/materials', {
    method: 'POST',
    body: material,
  })
}
