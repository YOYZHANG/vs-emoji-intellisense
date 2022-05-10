import { workspace } from 'vscode'
import { EXT_NAME, EXT_NAMESPACE } from './meta'

function getConfig<T>(key: string): T | undefined {
  return workspace.getConfiguration().get<T>(key)
}

export const config = {
  languageIds: getConfig(`${EXT_NAMESPACE}.lanuageIds`),
  lastSearch: ''
}
