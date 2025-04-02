import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function addPageToNotionList(title: string, content: string) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID!,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
      children: [
        {
          paragraph: {
            rich_text: [
              {
                text: {
                  content: content,
                },
              },
            ],
          },
        },
      ],
    });

    console.log('Successfully created new page:', response.id);
    return response;
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
}

// Example usage
async function main() {
  try {  
    // Try to add a new page
    const title = 'New Task';
    const content = 'This is a new task added via the API';
    await addPageToNotionList(title, content);
  } catch (error) {
    console.error('Failed:', error);
  }
}

main();