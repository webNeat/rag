import path from 'path'
import yaml from 'yaml'

export async function add_file_to_documentation(doc: db.Documentation, clone_path: string, filename: string) {
  const absolute_path = path.join(clone_path, filename)
  const chunks = await get_file_chunks(absolute_path)
  const file = await db.files.create({
    documentation_id: doc.id,
    path: filename,
    hash: await hash_file(absolute_path),
  })
  for (let index = 0; index < chunks.length; index++) {
    const { metadata, content } = chunks[index]
    const text = `${yaml.stringify(metadata)}\n---\n${content}`
    const embedding = await embed(text)
    await db.chunks.create({ file_id: file.id, index, metadata, content, embedding })
  }
}
