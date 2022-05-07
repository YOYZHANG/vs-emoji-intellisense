import { gemoji } from './emojis'

export interface EmojiMeta {
  emoji: string
  names: string[]
  tags: string[]
  description: string[]
  category: string
}

export const collections = (() => {
  const result = []
  for (const i of gemoji) {
    for (const name of i.names)
      result.push({ name, ...i })
  }

  return result
})()

export function getEmojiInfo(key: string) {
  const result = collections.filter(i => i.name.toLowerCase() === key.toLowerCase())

  return result.length ? result[0] : null;
}

export const categorys = gemoji.map(i => i.category)
