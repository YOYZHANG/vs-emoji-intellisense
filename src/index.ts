import { ExtensionContext } from 'vscode'
import { version } from '../package.json'
import { RegisterAnnotations } from './annotation'
import { RegisterCommands } from './commands'
import { RegisterCompletion } from './completion'
import { RegisterExplorer } from './explorer'
import { Log } from './utils'

export async function activate(ctx: ExtensionContext) {
  Log.info(`Activated, v${version}`)

  RegisterAnnotations(ctx)
  RegisterCompletion(ctx)
  RegisterCommands(ctx)
	RegisterExplorer(ctx)
}

export function deactivate() {
  Log.info('Deactivated')
}

