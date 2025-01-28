import { add_file_to_documentation } from './common'

type Options = {
  repo_url: string
  subdir: string
  branch: string
}
export async function update(name: string, options: Options) {
  const documentation = await db.documentations.get(name)
  if (!documentation) {
    throw new Error(`Documentation ${name} not found. Use 'rag docs add ${name}' to create it.`)
  }
  await db.documentations.update(name, options)
  const clone_path = await clone_repo(documentation.repo_url, documentation)
  const files = await db.files.find({ documentation_id: documentation.id })
  const seen_filenames = new Set<string>()
  for await (const filename of get_md_files(clone_path)) {
    seen_filenames.add(filename)
    const file = files.find((f) => f.filename === filename)
    if (file) {
      const hash = await hash_file(path.join(clone_path, filename))
      if (file.hash === hash) continue
      await db.chunks.remove({ file_id: file.id })
      await db.files.remove({ id: file.id })
    }
    await add_file_to_documentation(documentation, clone_path, filename)
  }
  const unseen_files = files.filter((f) => !seen_filenames.has(f.filename))
  await delete_files_and_chunks(unseen_files)
}

async function delete_files_and_chunks(files: db.File[]) {
  for (const file of files) {
    await db.chunks.remove({ file_id: file.id })
    await db.files.remove({ id: file.id })
  }
}
