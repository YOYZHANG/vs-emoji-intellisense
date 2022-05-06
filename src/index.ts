import type { ExtensionContext } from 'vscode'
import { version } from '../package.json'
import { Log } from './utils'

export async function activate(ctx: ExtensionContext) {
  Log.info(`Activated, v${version}`)
}

export function deactivate() {
  Log.info('Deactivated')
}
