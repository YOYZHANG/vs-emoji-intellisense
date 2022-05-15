import type { ExtensionContext, TreeDataProvider, TreeItem } from 'vscode'
import { EventEmitter, TreeItemCollapsibleState, window } from 'vscode'
import Fuse from 'fuse.js'
import { categorys, collections } from './collection'
import { EXT_NAMESPACE } from './meta'
import { Log } from './utils'
import { config } from './config'
import { RegisterExploreCommands } from './commands'

export interface TreeNode extends TreeItem {
  type?: 'search' | 'category' | 'emoji'
  name?: string
}

export interface EmojiTreeDataProvider extends TreeDataProvider<TreeNode> {
  refresh: () => void
  _onDidChangeTreeData: EventEmitter<TreeNode | null>
}

export function RegisterExplorer(ctx: ExtensionContext) {
  function getSearchResult(element: TreeNode): TreeNode[] {
    const fuse = new Fuse(collections, {
      isCaseSensitive: false,
      shouldSort: true,
      includeMatches: true,
      includeScore: true,
      threshold: 0.3,
      location: 0,
      distance: 10000, // https://fusejs.io/concepts/scoring-theory.html#distance-threshold-and-location
      keys: [
        { name: 'name', weight: 0.9 },
      ],
    })

    const result = fuse.search(config.lastSearch)

    if (!result.length)
      Log.error(`No icons found matching ${config.lastSearch}`)

    return result.map(i => ({
      type: 'emoji',
      label: i.item.emoji,
      description: i.item.name,
      tooltip: i.item.description,
    }))
  }

  const treeDataProvider: EmojiTreeDataProvider = {
    _onDidChangeTreeData: new EventEmitter(),
    getTreeItem(element: TreeNode): TreeNode {
      if (element.type === 'emoji') {
        return {
          type: element.type,
          label: element.label,
          description: element.description,
          tooltip: element.tooltip as string,
          collapsibleState: TreeItemCollapsibleState.None,
          contextValue: 'emoji',
          command: {
            command: `${EXT_NAMESPACE}.insertEmojiInActiveEditor`,
            arguments: [element],
            title: 'paste emoji',
          },
        }
      }
      else if (element.type === 'search') {
        return {
          type: element.type,
          label: element.label,
          description: element.description,
          collapsibleState: TreeItemCollapsibleState.Collapsed,
          contextValue: 'emojiSearch',
        }
      }
      else {
        return {
          type: element.type,
          label: element.label,
          description: element.description as string,
          collapsibleState: TreeItemCollapsibleState.Collapsed,
        }
      }
    },
    getChildren(element?: TreeNode): TreeNode[] {
      if (element) {
        if (element.type === 'search') {
          return getSearchResult(element)
        }
        else {
          const categoryEmojis = collections.filter(item => item.category === element.label)

          return categoryEmojis.map(i => ({
            type: 'emoji',
            label: i.emoji,
            description: i.name,
            tooltip: i.description,
          }))
        }
      }
      else {
        const children: TreeNode[] = []

        if (config.lastSearch) {
          children.push({
            type: 'search',
            label: 'Search Result',
          })
        }

        for (const i of categorys) {
          children.push({
            type: 'category',
            label: i,
            description: `${collections.filter(item => item.category === i).length} emojis`,
          })
        }

        return children
      }
    },
    getParent(element: TreeNode) {
      return element.type === 'search' || element.type === 'category'
        ? null
        : {
            type: 'search',
            label: 'Search Result',
          }
    },
    refresh() {
      this._onDidChangeTreeData.fire(null)
    },
  }

  treeDataProvider.onDidChangeTreeData = treeDataProvider._onDidChangeTreeData.event

  const treeView = window.createTreeView('emojiExplorer', { treeDataProvider })

  treeView.onDidChangeVisibility(
    event => event.visible && treeDataProvider.refresh(),
  )

  RegisterExploreCommands(ctx, 'performEmojiSearch', (search: string) => {
    if (!search)
      return

    config.lastSearch = search

    treeDataProvider.refresh()
    treeView.reveal(
      {
        type: 'search',
        label: 'Search Result',
      },
      {
        focus: true,
        expand: true,
      },
    )
  })

  RegisterExploreCommands(ctx, 'closeSearch', async () => {
    config.lastSearch = ''
    treeDataProvider.refresh()
  })
}

