export async function remove(name: string) {
  const documentation = await db.documentations.get(name)
  if (!documentation) return
  const files = await db.files.find({ documentation_id: documentation.id })
  await delete_files_and_chunks(files)
  await db.documentations.remove(name)
}
