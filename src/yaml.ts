import yaml from 'js-yaml'
import { readFileSync } from 'fs'

import { Collection, ConfigYaml, Field, Relation } from './types'

const parseFields = (fields: Field[], prevName: string, memo: Relation[] = []): Relation[] => {
    fields.forEach(field => {
        if ('fields' in field && field.fields?.length) {
            return parseFields(field.fields, `${prevName}.${field.name}`, memo)
        }

        if (field.widget === 'relation') {
            const { name, collection } = field;
            memo.push([`${prevName}.${name}`, collection])
        }
    })

    return memo
}

export const getRelations = (items: Collection[]): Relation[] => {
    return items.reduce((cv, collection) => {
        if ('folder' in collection) {
            return [
                ...cv,
                ...parseFields(collection.fields, collection.name)
            ]
        }

        if ('files' in collection) {
            return [
                ...cv,
                ...collection.files.reduce((cv, file) => [
                    ...cv,
                    ...parseFields(file.fields, file.name)
                ], [] as Relation[])
            ]
        }

        return cv
    }, [] as Relation[])
}

export const getRelationsFromYaml = (path: string): Relation[] => {
    const document = loadYaml(path);
    return getRelations(document.collections);
}

export const loadYaml = (path: string): ConfigYaml => {
    return yaml.load(readFileSync(path, 'utf8')) as ConfigYaml
};
