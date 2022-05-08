import { TreeDataProvider, TreeItem, TreeItemCollapsibleState, window } from "vscode";
import { categorys, collections } from "./collection";

export function RegisterExplorer() {
  const treeDataProvider: TreeDataProvider<TreeItem> = {
    getTreeItem(element): TreeItem {
      return element
    },
    getChildren(element?: TreeItem): TreeItem[] {
      if (element) {
        const children = collections.filter(item => item.category === element.label)

        return children.map(i => {
          return {
            label: i.emoji,
            id: i.name,
            description: i.name,
            collapsibleState: TreeItemCollapsibleState.None
          }
        })
      }
      else {
        const children = []

        for (let i of categorys) {
          children.push({
            label: i,
            collapsibleState: TreeItemCollapsibleState.Collapsed,
            description: `${collections.filter(item => item.category === i).length} emojis`
          })
        }

        return children
      }
    }
  }

  window.createTreeView('emojiExplorer', { treeDataProvider });
}
