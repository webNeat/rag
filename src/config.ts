import os from 'os'
import path from 'path'
import yaml from 'yaml'
import z from 'zod'

const Config = z.object({
  database_path: z.string(),
})
export type Config = z.infer<typeof Config>

const config_path = path.join(os.homedir(), '.rag/config.yaml')
const defaults: Config = {
  database_path: path.join(os.homedir(), '.rag/db.sqlite'),
}
let config: Config | undefined

export async function get() {
  if (config === undefined) {
    if (!(await exists())) {
      await set(defaults)
      config = defaults
    } else {
      config = Config.parse(yaml.parse(await Bun.file(config_path).text()))
    }
  }
  return config
}

export async function set(config: Config) {
  await Bun.write(config_path, yaml.stringify(Config.parse(config)))
}

async function exists() {
  return Bun.file(config_path).exists()
}
