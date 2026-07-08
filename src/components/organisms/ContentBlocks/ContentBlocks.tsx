import type { Block } from '@/content/materials'

// Organism: render body materi (array Block) jadi elemen HTML.
// Nambah tipe blok? Tambah case di sini + tipe di content/materials.ts.
export function ContentBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={i} className="break-words text-xl font-bold text-foam">
                {block.text}
              </h2>
            )
          case 'paragraph':
            return (
              <p key={i} className="break-words leading-relaxed text-mist">
                {block.text}
              </p>
            )
          case 'list':
            return (
              <ul key={i} className="list-disc space-y-1 break-words pl-6 text-mist marker:text-surf">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )
          case 'code':
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-lg border border-line bg-abyss p-4 text-sm text-foam"
              >
                <code>{block.code}</code>
              </pre>
            )
        }
      })}
    </div>
  )
}
