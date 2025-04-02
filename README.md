# Notion Todo List Manager

A program to maintain todolists in Notion.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
NOTION_API_KEY=your_notion_api_key_here
NOTION_PAGE_ID=your_page_id_here
```

To get these values:
- Create a Notion integration at https://www.notion.so/my-integrations
- Copy the API key
- Share your Notion page with the integration
- Copy the page ID from the URL (it's the part after the workspace name and before any question marks)

## Usage

1. Build the project:
```bash
npm run build
```

2. Run the program:
```bash
npm start
```

Or run directly with ts-node:
```bash
npm run dev
```

## Customization

You can modify the `main()` function in `src/index.ts` to change the title and content of the new pages being created.