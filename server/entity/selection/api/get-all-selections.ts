// import {omit} from 'lodash';
// import {dbManager} from 'app/lib/db-manager';
// import {Selection} from 'entity/selection';

// interface TreeItem {
//     item: Partial<Selection>;
//     childrens: TreeItem[];
// }

// function makeTree(list: Selection[], level: number) {
//     const result: TreeItem[] = [];

//     const roots = list.filter((it) => it.tpath.split('.').length === level);

//     roots.forEach((root) => {
//         const childrens = list.filter((it) => it.tpath.startsWith(`${root.tpath}.`));

//         result.push({
//             item: omit(root, ['id', 'parentId', 'tpath', 'isRoot', 'isShow']),
//             childrens: makeTree(childrens, level + 1)
//         });
//     });

//     return result;
// }

// export async function getAllSelections() {
//     const connection = await dbManager.getConnection();

//     const selections = await connection.getRepository(Selection).find({
//         relations: [],
//         where: {isShow: true},
//         order: {tpath: 'ASC'}
//     });

//     return makeTree(selections, 1);
// }
