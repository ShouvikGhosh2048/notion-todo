import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Example usage
export async function GET(request: Request) {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: process.env.NOTION_PAGE_ID!,
    });

    const childDatabase = blocks.results.find(block => "type" in block && block.type === 'child_database');
    if (!childDatabase) {
      throw new Error('Child database not found');
    }
    const databasePages = await notion.databases.query({
      database_id: childDatabase.id,
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending"
        }
      ],
      page_size: 1
    });
    const latestPage = databasePages.results[0];
    if (!latestPage || !('properties' in latestPage) || !('Name' in latestPage.properties) || 
        latestPage.properties.Name.type !== 'title' || !latestPage.properties.Name.title.length) {
      throw new Error('No pages found in database');
    }
    const latestPageTitle = (latestPage.properties.Name.title as Array<{ text: { content: string } }>)[0].text.content;

    let pageId = latestPage.id;
    const currentDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const monthYear = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    if (monthYear !== latestPageTitle) {
      const newPage = await notion.pages.create({
        parent: {
          database_id: childDatabase.id,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: monthYear,
                },
              },
            ],
          },
        },
        children: [],
      });
      pageId = newPage.id;
    }

    const currentDateString = currentDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    const todos = blocks.results.filter(block => "type" in block && block.type === 'to_do');
    await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          type: "heading_2",
          heading_2: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: currentDateString
                }
              }
            ]
          }
        },
        ...todos.map(todo => ({
          type: "to_do" as const,
          to_do: {
            rich_text: todo.to_do.rich_text.map(item => ({
              type: "text" as const,
              text: {
                content: item.plain_text,
                link: item.href ? { url: item.href } : null
              },
              annotations: item.annotations
            })),
            checked: false,
            color: "default" as const
          }
        }))
      ]
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed:', error);
  }
}