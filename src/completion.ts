import type { CompletionItemProvider, ExtensionContext, TextDocument } from 'vscode'
import { CompletionItem, CompletionItemKind, Position, Range, languages } from 'vscode'
import { collections } from './collection'

const REGEX_COLLECTION = /(\:[\w\d+_-])/
export function RegisterCompletion(ctx: ExtensionContext) {
  const emojiProvider: CompletionItemProvider = {
    provideCompletionItems(document: TextDocument, position: Position) {
      if (position.character === 0)
        return []

      const line = document.getText(new Range(new Position(position.line, 0), new Position(position.line, position.character)))

      const match = line.match(REGEX_COLLECTION)

      if (!match)
        return []

      return collections.map((x) => {
        const item = new CompletionItem(`${x.emoji} :${x.name}:`, CompletionItemKind.Color)
        item.filterText = `:${x.name}:`
        item.insertText = `${x.emoji}`
        item.range = new Range(position.translate(0, -2), position)
        return item
      })
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
    languages.registerCompletionItemProvider(
      'git-commit',
      emojiProvider,
      ':',
    ),
  )
}
