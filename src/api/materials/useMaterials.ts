import { useQuery } from '@tanstack/react-query'
import { getMaterials } from './getMaterials'

// Satu query dipakai bersama: list, detail (cari by slug), & home.
// react-query cache-nya di-share lewat queryKey yang sama.
export function useMaterials() {
  return useQuery({ queryKey: ['materials'], queryFn: getMaterials })
}
