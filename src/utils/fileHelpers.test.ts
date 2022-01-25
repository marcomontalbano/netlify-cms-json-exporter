import { test } from 'uvu'
import * as assert from 'uvu/assert'

import mock from 'mock-fs';

import { readDirectoryAsJson, readdirSync, readFileAsJson, readNetlifyContent } from './fileHelpers';

test.before(() => {
    mock({
        '/content/collections': {
            'collection-1.json': JSON.stringify({
                id: '1',
                name: 'Collection 1',
            }),
            'collection-2.json': JSON.stringify({
                id: '2',
                name: 'Collection 2',
            }),
            'a-non-json-file.txt': '',
        },
        '/content/profile.json': JSON.stringify({
            id: '1',
            fullname: 'John Doe',
        }),
        '/content/.DS_Store': 'something here',
        '/content/another-non-json-file.txt': ':(',
    });
})

test.after(() => mock.restore())

test('readdirSync should behave like the original fs.readdirSync but also add the original path as prefix', () => {
    const content = readdirSync('/content');

    assert.equal(content, [
        '/content/collections',
        '/content/profile.json'
    ]);
})

test('readFileAsJson should parse a file as json', () => {
    const content = readFileAsJson('/content/profile.json')
    assert.equal(content, { id: '1', fullname: 'John Doe' })
})

test('readFileAsJson should fails if is not a file', () => {
    assert.throws(() => readFileAsJson('/content/collections'), '"/content/collections" is not a file!')
})

test('readFileAsJson should fails if is not a file', () => {
    assert.throws(() => readFileAsJson('/content/collections'), '"/content/collections" is not a file!')
})

test('readDirectoryAsJson should scan a directory and parse all files as json', () => {
    const content = readDirectoryAsJson('/content/collections')
    assert.equal(content, [
        { id: '1', name: 'Collection 1' },
        { id: '2', name: 'Collection 2' }
    ])
})

test('readDirectoryAsJson should fails if is not a directory', () => {
    assert.throws(() => readDirectoryAsJson('/content/profile.json'), '"/content/profile.json" is not a directory!')
})

test('readNetlifyContent should scan a Netlify CMS content folder and return a structured representation', () => {
    const content = readNetlifyContent('/content')
    assert.equal(content, [
        ['collections', [
            { id: '1', name: 'Collection 1' },
            { id: '2', name: 'Collection 2' }
        ]],
        ['profile', { id: '1', fullname: 'John Doe' }]
    ])
})

test.run();

