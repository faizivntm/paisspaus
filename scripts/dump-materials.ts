// Dump array `materials` ke materials.json untuk migrasi ke database.
// Jalankan dari root frontend: node scripts/dump-materials.ts
import { writeFileSync } from 'node:fs'
import { materials } from '../src/content/materials.ts'

writeFileSync('materials.json', JSON.stringify(materials, null, 2), 'utf-8')
console.log(`Dumped ${materials.length} materi -> materials.json`)
