import { XMLParser } from 'fast-xml-parser'
import { readFileSync, writeFileSync } from 'fs'

const parser = new XMLParser();
let wp_export = parser.parse(readFileSync('wordpress-export.xml'));
let posts = wp_export.rss.channel.item;

let readme = `
# my-gp-blog
This is a backup of my Google Plus Wordpress blog. (http://gp.estontorise.hu/)

`
const template = readFileSync('template.html')
for (const post of posts) {

    if (post['wp:post_type'] != 'post')
        continue;

    let content: string = template.toString()
    for (const key of Object.keys(post)) {
        content = content.split(`{{${key}}}`).join(post[key])
    }
    writeFileSync(`posts/${post['wp:post_id']}.html`, content)
    readme += `[${post.title}](https://thebojda.github.io/my-gp-blog/posts/${post['wp:post_id']}.html)\n\n`
}

writeFileSync('README.md', readme)