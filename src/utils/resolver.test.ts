import { test } from 'uvu'
import { equal } from 'uvu/assert'

import { Content, ContentCollection } from '../types';

import { resolveNestedObjects, resolveFieldPaths, resolveRelations } from './resolver';


test('resolveNestedObjects should be able to resolve nested objects without array', () => {
    const content = {
        other: { color: 'blue' },
        person: {
            name: 'John Doe',
            link: {
                url: 'https://example.com/1'
            }
        },
    };

    equal(
        resolveNestedObjects(['person', 'link', 'url'], content),
        ['person.link.url']
    )
})

test('resolveNestedObjects should be able to resolve nested objects with array', () => {
    const content = {
        people: [
            {
                name: 'John Doe',
                links: [
                    { url: 'https://example.com/1' },
                    { url: 'https://example.com/2' }
                ]
            },
            {
                name: 'Foo Bar',
                links: [
                    { url: 'https://example.com/1' },
                    { url: 'https://example.com/2' }
                ]
            }
        ]
    };

    equal(
        resolveNestedObjects(['people', 'links', 'url'], content),
        [
            'people[0].links[0].url',
            'people[0].links[1].url',
            'people[1].links[0].url',
            'people[1].links[1].url'
        ]
    )
})

test('resolveNestedObjects should not resolve unexisting keys', () => {
    const content = {
        people: [{
            links: [
                { url: 'https://example.com/1' },
                { name: 'Foo', url: 'https://example.com/2' },
            ]
        }]
    };

    equal(
        resolveNestedObjects(['people', 'links', 'name'], content),
        ['people[0].links[1].name']
    )
})

test('resolveFieldPaths should be able to resolve nested objects without array', () => {
    const content = {
        other: { color: 'blue' },
        person: {
            name: 'John Doe',
            link: {
                url: 'https://example.com/1'
            }
        },
    };

    equal(
        resolveFieldPaths([['person.link.url', 'relation']], content),
        [['person.link.url', 'relation']]
    )
})

test('resolveFieldPaths should be able to resolve nested objects with array', () => {
    const content = {
        people: [
            {
                name: 'John Doe',
                links: [
                    { url: 'https://example.com/1' },
                    { url: 'https://example.com/2' }
                ]
            },
            {
                name: 'Foo Bar',
                links: [
                    { url: 'https://example.com/1' },
                    { url: 'https://example.com/2' }
                ]
            }
        ]
    };

    equal(
        resolveFieldPaths([['people.links.url', 'relation']], content),
    [
        ['people[0].links[0].url', 'relation'],
        ['people[0].links[1].url', 'relation'],
        ['people[1].links[0].url', 'relation'],
        ['people[1].links[1].url', 'relation']
    ])
})

test('resolveFieldPaths should not resolve unexisting keys', () => {
    const content = {
        people: [{
            links: [
                { url: 'https://example.com/1' },
                { name: 'Foo', url: 'https://example.com/2' },
            ]
        }]
    };

    equal(
        resolveFieldPaths([['people.links.name', 'relation']], content),
    [['people[0].links[1].name', 'relation']])
})

test('resolveRelations should be able to resolve nested objects with array', () => {
    const content: Content<ContentCollection> = {
        people: [
            {
                id: '1',
                name: 'John Doe',
                links: [
                    { rel: '1' },
                    { rel: '2' }
                ]
            },
            {
                id: '2',
                name: 'Foo Bar',
                links: [
                    { rel: '2' },
                    { rel: '1' }
                ]
            }
        ],
        links: [
            {
                id: '1',
                url: 'https://example.com/1'
            },
            {
                id: '2',
                url: 'https://example.com/2'
            }
        ]
    };

    equal(
        resolveRelations([
            ['people[0].links[0].rel', 'links'],
            ['people[0].links[1].rel', 'links'],
            ['people[1].links[0].rel', 'links'],
            ['people[1].links[1].rel', 'links']], content),
    [
        ['people[0].links[0].rel', 'links[0]'],
        ['people[0].links[1].rel', 'links[1]'],
        ['people[1].links[0].rel', 'links[1]'],
        ['people[1].links[1].rel', 'links[0]']
    ])
})

test('resolveRelations should not fail if the relation is empty', () => {
    const content: Content<ContentCollection> = {
        people: [
            {
                id: '1',
                name: 'John Doe',
                links: [
                    { rel: '' },
                    { rel: '2' }
                ]
            }
        ],
        links: [
            {
                id: '1',
                url: 'https://example.com/1'
            },
            {
                id: '2',
                url: 'https://example.com/2'
            }
        ]
    };

    equal(
        resolveRelations([
            ['people[0].links[0].rel', 'links'],
            ['people[0].links[1].rel', 'links']], content),
    [
        ['people[0].links[1].rel', 'links[1]']
    ])
})

test.run();
