import type { ExtensionContext } from 'vscode'
import { window } from 'vscode'

export function RegisterAnnotations(ctx: ExtensionContext) {
  window.onDidChangeVisibleTextEditors(() => {

  }, null, ctx.subscriptions)
}
