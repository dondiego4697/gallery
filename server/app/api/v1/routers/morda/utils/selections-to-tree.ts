import {pick, sortBy} from 'lodash';

import {Selection} from 'entity/selection';

interface PartialSelection {
    code: string;
    name: string;
    description?: string;
    imageUrl: string;
    sortOrder: number;
    createdAt: Date;
}

interface TreeItem {
    item: PartialSelection;
    childrens: TreeItem[];
}

export function selectionsToTree(list: Selection[], level = 1) {
    const result: TreeItem[] = [];

    const roots = list.filter((it) => it.path.split('.').length === level);

    roots.forEach((root) => {
        const childrens = list.filter((it) => it.path.startsWith(`${root.path}.`));

        result.push({
            item: pick(root, ['code', 'name', 'description', 'imageUrl', 'sortOrder', 'createdAt']),
            childrens: sortBy(selectionsToTree(childrens, level + 1), (it) => it.item.sortOrder)
        });
    });

    return sortBy(result, (it) => it.item.sortOrder);
}
