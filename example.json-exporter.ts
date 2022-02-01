import { writeFileSync } from 'fs'
import { getContent } from './src'

const content = getContent('../netlify-cms-widgets/playground/config.yml', '../netlify-cms-widgets/content')

writeFileSync('db.json', JSON.stringify(content, undefined, 2))

console.log(
  JSON.stringify(content, undefined, 2)
)
