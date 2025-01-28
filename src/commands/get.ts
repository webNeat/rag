type Options = { count: number; json: boolean }

export async function get(prompt: string, options: Options) {
  prompt = prompt || (await Bun.stdin.text())
  console.log(`Getting relevant parts from documentations for prompt "${prompt}" with options ${JSON.stringify(options)}`)
}
