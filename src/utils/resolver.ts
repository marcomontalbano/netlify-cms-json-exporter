import dot from 'dot-object'

import { Content, Relation } from '../types'

export const resolveNestedObjects = (keys: string[], content: { [key: string]: unknown }, currentIndex: number = 0, currentKey: string = '', memo: string[] = []) => {
    const key = `${currentKey ? `${currentKey}.` : ''}${keys[currentIndex]}`;

    const currentContent = dot.pick(key, content)

    if (currentIndex === keys.length) {
        memo.push(currentKey);
        return memo;
    }

    if (currentContent === undefined) {
        return [];
    }

    if (Array.isArray(currentContent)) {
        currentContent.forEach((_, i) => {
            resolveNestedObjects(keys, content, currentIndex + 1, `${key}[${i}]`, memo)
        })
    } else {
        resolveNestedObjects(keys, content, currentIndex + 1, key, memo)
    }

    return memo
}

export const resolveFieldPaths = <T>(yamlRelations: Relation[], content: Content<T>): Relation[] => {
    return yamlRelations.map(([fieldPath, relation]) => {
        return resolveNestedObjects(fieldPath.split('.'), content).map(resolvedFieldPath => ([
            resolvedFieldPath,
            relation
        ]));
    }).flat() as Relation[];
}

export const resolveRelations = <T extends { id: string }>(resolvedFieldPaths: Relation[], content: Content<T>): Relation[] => {
    const resolvedRelations: (Relation | undefined)[] = resolvedFieldPaths.map(([fieldPath, relation]) => {
        const fieldObject = dot.pick(fieldPath, content) as string;
        const relationObject = dot.pick(relation, content) as T[];
        const relationIndex = relationObject.findIndex(obj => obj.id === fieldObject);

        if (relationIndex < 0) {
            return undefined;
        }

        return [
            fieldPath,
            `${relation}[${relationIndex}]`
        ];
    });

    return resolvedRelations.filter((relation): relation is Relation => relation !== undefined);
}
