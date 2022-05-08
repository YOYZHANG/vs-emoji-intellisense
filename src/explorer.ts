import { EventEmitter, ExtensionContext, TextDocumentContentProvider, TreeDataProvider, TreeItem, TreeItemCollapsibleState, window } from "vscode";
import { categorys, collections } from "./collection";
import { EXT_NAMESPACE } from "./meta";
import Fuse from 'fuse.js'
import { Log } from "./utils";
import { config } from "./config";
import { RegisterExploreCommands } from "./commands";

export interface TreeNode extends TreeItem {
  type?: 'search' | 'category' | 'emoji'
}

export interface EmojiTreeDataProvider extends TreeDataProvider<TreeNode> {
  refresh: () => void;
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
          { name: "name", weight: 0.9 }
        ],
      })

      const result = fuse.search(config.lastSearch)

      if (!result.length)
        Log.error(`No icons found matching ${config.lastSearch}`)
      
      return result.map(i => ({
          type: 'emoji',
          label: i.item.emoji,
          id: i.item.name,
          description: i.item.name,
          collapsibleState: TreeItemCollapsibleState.None,
          contextValue: 'emoji',
          command: {
            command: `${EXT_NAMESPACE}.insertEmojiInActiveEditor`,
            arguments: [i.item],
            title: 'paste emoji'
          }
      }))
  }

  const treeDataProvider: EmojiTreeDataProvider = {
    _onDidChangeTreeData: new EventEmitter(),
    getTreeItem(element: TreeNode): TreeNode {
      return element
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
              id: i.name,
              description: i.description,
              collapsibleState: TreeItemCollapsibleState.None,
              contextValue: 'emoji',
              command: {
                command: `${EXT_NAMESPACE}.insertEmojiInActiveEditor`,
                arguments: [element],
                title: 'paste emoji'
              }
            }))
        }
      }
      else {
        const children: TreeNode[] = []

        if (config.lastSearch) {
          children.push({
            type: 'search',
            label: 'Search Result',
            id: 'Search Result',
            contextValue: 'emojiSearch',
            collapsibleState: TreeItemCollapsibleState.Collapsed,
          });
        }

        for (let i of categorys) {
          children.push({
            type: 'category',
            label: i,
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            description: `${collections.filter(item => item.category === i).length} emojis`
          })
        }

        return children
      }
    },
    refresh() {
      this._onDidChangeTreeData.fire(null)
    }
  }

  treeDataProvider.onDidChangeTreeData = treeDataProvider._onDidChangeTreeData.event;

  const treeView = window.createTreeView('emojiExplorer', { treeDataProvider });

  treeView.onDidChangeVisibility(
    (event) => event.visible && treeDataProvider.refresh()
  );

  RegisterExploreCommands(ctx, 'performEmojiSearch', async (search: string) => {
      if (!search)
        return
  
      config.lastSearch = search
  
      treeDataProvider.refresh()
      await treeView.reveal(
        {
          label: 'Search Result'
        },
        {
          focus: true,
          expand: true,
        }
      );
  })
}

