import type { CompletionItemProvider, ExtensionContext, TextDocument } from 'vscode'
import { CompletionItem, CompletionItemKind, Position, Range, languages } from 'vscode'
import { collections } from './collection'
import { getMarkdown } from './markdown'

const REGEX_COLLECTION = /(?:\s|^)(:$)|(:[\w\d_+-]+?)$|(:[\w\d_+-]+:)$/
export function RegisterCompletion(ctx: ExtensionContext) {
  const emojiProvider: CompletionItemProvider = {
    provideCompletionItems(document: TextDocument, position: Position) {
      const line = document.getText(new Range(new Position(position.line, 0), new Position(position.line, position.character)))

      const match = line.match(REGEX_COLLECTION)

      if (!match)
        return []

      return collections.map((x) => {
        const item = new CompletionItem(`${x.emoji} :${x.name}:`, CompletionItemKind.Value)
        item.filterText = `:${x.name}:`
        item.insertText = `${x.emoji}`
        item.range = new Range(position.translate(0, -1), position)
        return item
      })
    },
    async resolveCompletionItem(item: CompletionItem) {
      return {
        ...item,
        documentation: await getMarkdown(ctx, item.label as string),
      }
    },
  }
  ctx.subscriptions.push(
    languages.registerCompletionItemProvider(
      'markdown',
      emojiProvider,
      ':',
    ),
    languages.registerCompletionItemProvider(
      'plaintext',
      emojiProvider,
      ':',
    ),
  )
}
