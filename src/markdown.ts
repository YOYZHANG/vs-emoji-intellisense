import type { ExtensionContext } from 'vscode'
import { MarkdownString } from 'vscode'

export async function getMarkdown(ctx: ExtensionContext, key: string) {
  // ???
  return new MarkdownString('| |\n|:---:|\n ![](ddddd) |\n| [\`sss\`] |')
}
