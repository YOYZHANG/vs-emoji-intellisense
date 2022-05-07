import type { DecorationOptions, ExtensionContext, TextEditor } from 'vscode'
import { DecorationRangeBehavior, Range, window, workspace } from 'vscode'
import { getEmojiInfo } from './collection'
import { isTruthy } from './utils/types'

export function RegisterAnnotations(ctx: ExtensionContext) {
  const InlineDecoration = window.createTextEditorDecorationType({
    textDecoration: 'none; opacity: 0.6 !important',
    rangeBehavior: DecorationRangeBehavior.ClosedClosed,
  })

  // const HideTextDecoration = window.createTextEditorDecorationType({
  //   textDecoration: 'none; display:none;',
  // })

  let editor: TextEditor | undefined
  let decorations: DecorationOptions[] = []
  function updateEditor(_editor?: TextEditor) {
    if (!_editor || editor === _editor)
      return

    editor = _editor
  }

  function refreshDecorations() {
    if (!editor)
      return

    editor.setDecorations(InlineDecoration, decorations)
  }

  async function updateDecorations() {
    if (!editor)
      return

    const text = editor.document.getText()
    const regex = /:([\w\d_+-]+?):/g
    regex.lastIndex = 0
    let match
    const keys: [Range, string][] = []

    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(text))) {
      const key = match[1]

      if (!key)
        continue

      const startPos = editor.document.positionAt(match.index)
      const endPos = editor.document.positionAt(match.index + key.length + 2)

      keys.push([new Range(startPos, endPos), key])
    }

    decorations = (await Promise.all(keys.map(async ([range, key]) => {
      const info = getEmojiInfo(key)

      if (!info)
        return undefined

      const item = {
        range,
        renderOptions: {
          after: {
            contentText: info.emoji,
            margin: '0.2em; transform: translate(-2px, 3px)',
            color: 'rgba(255, 255, 255)',
          },
        },
        // hoverMessage: await getEmojiMarkdown(ctx, key),

      }

      return item
    }))).filter(isTruthy)

    refreshDecorations()
  }

  let timeout: NodeJS.Timer | undefined
  function triggerUpdateDecorations(_editor?: TextEditor) {
    updateEditor(_editor)

    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }

    timeout = setTimeout(() => {
      updateDecorations()
    }, 200)
  }

  window.onDidChangeActiveTextEditor((e) => {
    triggerUpdateDecorations(e)
  }, null, ctx.subscriptions)

  workspace.onDidChangeTextDocument((event) => {
    if (window.activeTextEditor && event.document === window.activeTextEditor.document)
      triggerUpdateDecorations(window.activeTextEditor)
  }, null, ctx.subscriptions)

  updateEditor(window.activeTextEditor)
  triggerUpdateDecorations()
}
