import type { ExtensionContext } from 'vscode'
import { version } from '../package.json'
import { RegisterAnnotations } from './annotation'
import { RegisterCompletion } from './completion'
import { Log } from './utils'

export async function activate(ctx: ExtensionContext) {
  Log.info(`Activated, v${version}`)

  RegisterAnnotations(ctx)
  RegisterCompletion(ctx)
}

export function deactivate() {
  Log.info('Deactivated')
}

