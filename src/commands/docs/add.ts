type Options = {
  subdir: string
  branch: string
}
export async function add(name: string, repo_url: string, options: Options) {
  if (await db.documentations.has(name)) {
    throw new Error(`Documentation ${name} already exists. Use 'rag docs update ${name}' to update it.`)
  }

  const clone_path = await clone_repo(repo_url, options)
  const documentation = await db.documentations.create({ name, repo_url, ...options })
  const md_files = get_md_files(clone_path)
  for await (const filename of md_files) {
    await add_file_to_documentation(documentation, clone_path, filename)
  }
}
