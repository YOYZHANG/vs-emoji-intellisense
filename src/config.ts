import { workspace } from 'vscode'
import { computed, reactive } from '@vue/reactivity'
import { EXT_NAMESPACE } from './meta'

function getConfig<T>(key: string): T | undefined {
  return workspace.getConfiguration().get<T>(key)
}

async function setConfig(key: string, value: any, isGlobal = true) {
  return await workspace
    .getConfiguration()
    .update(key, value, isGlobal)
}

function createConfigRef<T>(key: string, defaultValue: T, isGlobal = true) {
  return computed({
    get: () => {
      return getConfig<T>(key) ?? defaultValue
    },
    set: (v) => {
      setConfig(key, v, isGlobal)
    },
  })
}

export const config = reactive({
  languageIds: createConfigRef(`${EXT_NAMESPACE}.lanuageIds`, ['markdown']),
  delimiters: createConfigRef(`${EXT_NAMESPACE}.delimiters`, [':', '/']),
})

const delimiters = computed(() => `[${config.delimiters.join('')}]`)

export const REGEX_NAMESPACE = computed(() => {
  return new RegExp(`(${delimiters.value})`)
})
