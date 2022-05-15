import type { ExtensionContext, TreeItem } from 'vscode'
import { SnippetString, commands, window } from 'vscode'
import { config } from './config'
import { EXT_NAMESPACE } from './meta'
import { Log } from './utils'

export function RegisterCommands(ctx: ExtensionContext) {
  ctx.subscriptions.push(
    commands.registerCommand(`${EXT_NAMESPACE}.showEmojiSearch`, async () => {
      const search = (await window.showInputBox({
        value: config.lastSearch,
        prompt: 'Search emoji',
        placeHolder: 'Search emoji',
      })) || ''

      commands.executeCommand(`${EXT_NAMESPACE}.performEmojiSearch`, search)
    }),
  )

  ctx.subscriptions.push(
    commands.registerCommand('emojiIntellSense.insertEmojiInActiveEditor', async (node: TreeItem) => {
      const editor = window.activeTextEditor

      if (editor)
        await editor.insertSnippet(new SnippetString(node.label as string))

      else
        Log.error('No active editor')
    }),
  )
}

export function RegisterExploreCommands(ctx: ExtensionContext, cmd: string, cb: (search: string) => void) {
  ctx.subscriptions.push(
    commands.registerCommand(`${EXT_NAMESPACE}.${cmd}`, cb),
  )
}
