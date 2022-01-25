import nodeFs from 'fs'
import nodePath from 'path'

import { ContentEntries } from '../types'

export const readdirSync = (path: string): string[] => {
    return nodeFs
        .readdirSync(path)
        .map((basename) => nodePath.resolve(path, basename))
        .filter(
            (basename) =>
                nodePath.extname(basename) === '.json' ||
                nodeFs.lstatSync(basename).isDirectory()
        );
}

export const readFileAsJson = <T>(file: string): T => {
    if (!nodeFs.lstatSync(file).isFile()) {
        throw new Error(`"${file}" is not a file!`)
    }

    return JSON.parse(nodeFs.readFileSync(file, 'utf8')) as T
}

export const readDirectoryAsJson = <T>(directory: string): T[] => {
    if (!nodeFs.lstatSync(directory).isDirectory()) {
        throw new Error(`"${directory}" is not a directory!`)
    }

    return readdirSync(directory).map((file) => readFileAsJson<T>(file));
}

export const readNetlifyContent = <T>(contentPath: string): ContentEntries<T> => {
    const contentEntries: ContentEntries<T> = readdirSync(contentPath).map((filepath) => {
        if (nodeFs.lstatSync(filepath).isFile()) {
            return [nodePath.basename(filepath, '.json'), readFileAsJson<T>(filepath)];
        }

        return [nodePath.basename(filepath), readDirectoryAsJson<T>(filepath)];
    });

    return contentEntries;
}
