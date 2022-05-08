import { ExtensionContext, SnippetString, TreeItem, window } from 'vscode'
import { commands } from 'vscode'
import { EXT_NAMESPACE } from './meta'
import { Log } from './utils'

export function RegisterCommands(ctx: ExtensionContext) {
  ctx.subscriptions.push(
    commands.registerCommand('emojiIntellSense.showEmojiSearch', async () => {
      const search = (await window.showInputBox({
        value: '',
        prompt: 'Search emoji',
        placeHolder: 'Search emoji'
      })) || ''

      commands.executeCommand('emojiIntellSense.showEmojiSearch', search)
    })
  )

  ctx.subscriptions.push(
    commands.registerCommand('emojiIntellSense.insertEmojiInActiveEditor', async (node: TreeItem) => {
      const editor = window.activeTextEditor

      if (editor) {
        await editor.insertSnippet(new SnippetString(node.label as string))
      }
      else {
        Log.error('No active editor')
      }
    })
  )
}
