import { program } from 'commander'
import { init } from './init'
import * as commands from './commands'

program.name('rag').version('0.0.1').description('Simple RAG system for developers')

const docs = program.command('docs').description('Manage documentations')

docs
  .command('add')
  .description('Add new documentation')
  .argument('<name>', 'Name of the documentation')
  .argument('<repo_url>', 'URL of the Git repository')
  .option('--subdir <subdir>', 'Subdirectory within the repository')
  .option('--branch <branch>', 'Branch to use', 'main')
  .action(commands.docs.add)

docs
  .command('update')
  .description('Update existing documentation')
  .argument('<name>', 'Name of the documentation')
  .option('--repo_url <repo_url>', 'New repository URL')
  .option('--subdir <subdir>', 'New subdirectory within the repository')
  .option('--branch <branch>', 'New branch to use')
  .action(commands.docs.update)

docs.command('remove').description('Remove existing documentation').argument('<name>', 'Name of the documentation').action(commands.docs.remove)

program
  .command('get')
  .description('Get relevant parts from documentations')
  .argument('[prompt]', 'Search prompt')
  .option('--count <count>', 'Number of relevant parts to retrieve', '5')
  .option('--json', 'Output results in JSON format')
  .action(commands.get)

init()
  .then(() => program.parseAsync())
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
