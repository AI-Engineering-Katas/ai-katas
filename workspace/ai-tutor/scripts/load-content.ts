import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { addDocuments } from '../lib/chroma/client';

async function loadContent() {
  try {
    console.log('Starting content loading process...');
    
    // Read the markdown file
    const filePath = path.join(process.cwd(), 'content', 'llm-capability.md');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Parse frontmatter and content
    const { data: frontmatter, content } = matter(fileContent);
    
    // Clean up the content (remove markdown formatting if desired)
    const cleanContent = content.trim();
    
    // Create metadata object
    const metadata = {
      title: frontmatter.title || 'Untitled',
      path: frontmatter.path || '/',
      type: frontmatter.type || 'document',
      category: frontmatter.category || 'uncategorized'
    };
    
    console.log('Adding document to ChromaDB:', metadata.title);
    
    // Add to ChromaDB
    await addDocuments([cleanContent], [metadata]);
    
    console.log('Content loaded successfully!');
  } catch (error) {
    console.error('Error loading content:', error);
    process.exit(1);
  }
}

// Run the script
loadContent(); 