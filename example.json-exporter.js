const fs = require('fs')
const { getContent } = require('./dist')

const content = getContent('../netlify-cms-widgets/playground/config.yml', '../netlify-cms-widgets/content')

// fs.writeFileSync('db.json', JSON.stringify(content, undefined, 2))

console.log(
    JSON.stringify(content, undefined, 2)
)
