import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = `${process.env.NOTION_DATABASE_ID}`

export async function getPages() {
  const pages = await notion.databases.query({
    database_id: databaseId
  })
  return pages
}

export async function getPage(id: string) {
  const page = await notion.pages.retrieve({ page_id: id });
  return page
}

export async function getBlocks(id: string) {
  const { results } = await notion.blocks.children.list({
    block_id: id
  })
  return results
}