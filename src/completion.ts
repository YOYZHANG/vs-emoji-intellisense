import type { CompletionItemProvider, ExtensionContext, TextDocument } from 'vscode'
import { CompletionItem, CompletionItemKind, Position, Range, languages } from 'vscode'
import { collections } from './collection'
import { REGEX_NAMESPACE, config } from './config'
// const REGEX_COLLECTION = /(\:[\w\d+_-]*)/
export function RegisterCompletion(ctx: ExtensionContext) {
  const emojiProvider: CompletionItemProvider = {
    provideCompletionItems(document: TextDocument, position: Position) {
      if (position.character === 0)
        return []

      const line = document.getText(new Range(new Position(position.line, 0), new Position(position.line, position.character)))

      const match = line.match(REGEX_NAMESPACE.value)

      if (!match)
        return []

      return collections.map((x) => {
        const item = new CompletionItem(`${x.emoji} ${x.name}`, CompletionItemKind.Color)
        item.filterText = `${match[1]}${x.name}`
        item.insertText = `${x.emoji}`
        item.range = new Range(position.translate(0, -match[1].length), position)
        return item
      })
    },
  }
  ctx.subscriptions.push(
    languages.registerCompletionItemProvider(
      config.languageIds,
      emojiProvider,
      ...config.delimiters,
    ),
  )
}
