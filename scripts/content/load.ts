import { getCollection } from '../../lib/chroma/client';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface DocContent {
  id: string;
  content: string;
  metadata: {
    title: string;
    path: string;
    type: 'capability' | 'solution' | 'tool';
    category?: string;
  };
}

async function loadContent() {
  try {
    const collection = await getCollection();
    
    // Read the content directory
    const contentPath = path.join(process.cwd(), 'content');
    const files = await fs.readdir(contentPath);
    
    const documents: DocContent[] = [];
    
    // Process each markdown file
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(contentPath, file), 'utf-8');
        const { data, content: markdownContent } = matter(content);
        
        // Extract metadata and content
        documents.push({
          id: file.replace('.md', ''),
          content: markdownContent,
          metadata: {
            title: data.title || file.replace('.md', ''),
            path: data.path || `/docs/${file}`,
            type: determineType(file),
            category: data.category
          }
        });
      }
    }
    
    // Add documents to collection
    if (documents.length > 0) {
      await collection.upsert({
        ids: documents.map(doc => doc.id),
        documents: documents.map(doc => doc.content),
        metadatas: documents.map(doc => doc.metadata)
      });
      
      console.log(`Successfully loaded ${documents.length} documents into Chroma`);
    } else {
      console.warn('No documents found to load');
    }
    
  } catch (error) {
    console.error('Error loading content:', error);
    process.exit(1);
  }
}

function determineType(filename: string): 'capability' | 'solution' | 'tool' {
  const name = filename.toLowerCase();
  if (name.includes('capability')) return 'capability';
  if (name.includes('solution')) return 'solution';
  return 'tool';
}

loadContent(); 