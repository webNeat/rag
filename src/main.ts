import { program } from 'commander'
import { init } from './init'

program.name('rag').version('0.0.1').description('Simple RAG system for developers')

const docs = program.command('docs').description('Manage documentations')

docs
  .command('add')
  .description('Add new documentation')
  .argument('<name>', 'Name of the documentation')
  .argument('<repo_url>', 'URL of the Git repository')
  .option('--subdir <subdir>', 'Subdirectory within the repository')
  .option('--branch <branch>', 'Branch to use', 'main')
  .action((name, repo_url, options) => {
    console.log(`Adding documentation ${name} from ${repo_url} with options ${JSON.stringify(options)}`)
  })

docs
  .command('update')
  .description('Update existing documentation')
  .argument('<name>', 'Name of the documentation')
  .option('--repo_url <repo_url>', 'New repository URL')
  .option('--subdir <subdir>', 'New subdirectory within the repository')
  .option('--branch <branch>', 'New branch to use')
  .action((name, options) => {
    console.log(`Updating documentation ${name} with options ${JSON.stringify(options)}`)
  })

docs
  .command('remove')
  .description('Remove existing documentation')
  .argument('<name>', 'Name of the documentation')
  .action((name) => {
    console.log(`Removing documentation ${name}`)
  })

program
  .command('get')
  .description('Get relevant parts from documentations')
  .argument('[prompt]', 'Search prompt')
  .option('--count <count>', 'Number of relevant parts to retrieve', '5')
  .option('--json', 'Output results in JSON format')
  .action(async (prompt, options) => {
    prompt = prompt || (await Bun.stdin.text())
    console.log(`Getting relevant parts from documentations for prompt "${prompt}" with options ${JSON.stringify(options)}`)
  })

init()
  .then(() => program.parseAsync())
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
