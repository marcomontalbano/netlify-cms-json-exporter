# Netlify CMS - JSON Exporter

[Netlify CMS](https://www.netlifycms.org/) stores the content in separate folders and files.
With `JSON Exporter` you can export all your Netlify CMS contents in a single object with all relations resolved.

This can be useful if need to inject your content as `props` inside your components.

## Usage

```sh
# with yarn
yarn add -D netlify-cms-json-exporter

# with npm
npm install --save-dev netlify-cms-json-exporter
```

### Export as `db.json`

```js
import fs from 'fs'
import { getContent } from 'netlify-cms-json-exporter'

const content = getContent('./public/admin/config.yml', './content')

fs.writeFileSync('db.json', JSON.stringify(content, undefined, 2))
```

### Typescript `.d.ts`

```js
// netlify-cms-exporter.js

import { getContent } from 'netlify-cms-json-exporter'

const content = getContent('./public/admin/config.yml', './content')

console.log(
  JSON.stringify(content, undefined, 2)
)
```

```sh
node netlify-cms-exporter.js | npx json-ts --stdin --prefix "" --rootName Content > db.d.ts
```
