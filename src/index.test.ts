import { test } from 'uvu'
import * as assert from 'uvu/assert'

import mock from 'mock-fs';

import { getContent } from './index';

test.before(() => {
    mock({
        '/config.yml': `
collections:
  - name: 'general'
    files: 
      - name: 'profile'
        label: 'Profile'
        file: 'content/profile.json'
        fields:
          - { label: 'ID', name: 'id', widget: 'id' }
          - { label: 'Favorite Color', name: 'favoriteColor', widget: 'relation', collection: 'colors', value_field: 'id', search_fields: ['name'], display_fields: ['name'] }
  - name: 'colors'
    label: 'Color'
    # folder: 'content/colors'
    fields:
      - { label: 'ID', name: 'id', widget: 'id' }
      - { label: 'Name', name: 'name', widget: 'string' }
`,
        '/content/colors': {
            'color-1.json': JSON.stringify({ id: '1', name: 'Red' }),
            'color-2.json': JSON.stringify({ id: '2', name: 'Green' }),
        },
        '/content/profile.json': JSON.stringify({ id: '1', favoriteColor: '2' }),
    })
})

test.after(() => {
    mock.restore()
})

test('netlify-cms should use the config.yml to get all relations and the content folder to generate a single object', () => {
    const content = getContent('/config.yml', '/content')

    assert.equal(content, {
        colors: [
            { id: '1', name: 'Red' },
            { id: '2', name: 'Green' },
        ],
        profile: {
            id: '1',
            favoriteColor: {
                id: '2',
                name: 'Green'
            }
        }
    })
})

test.run()
