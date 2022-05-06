import type { ExtensionContext } from 'vscode'
import { commands } from 'vscode'

export function RegisterCommands(ctx: ExtensionContext) {
  ctx.subscriptions.push(
    commands.registerCommand('', () => {

    }),
  )
}
