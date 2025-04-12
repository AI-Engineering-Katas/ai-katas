/**
 * Simple test script to verify ChromaDB connection
 * This doesn't require an OpenAI API key
 */

const CHROMA_API_URL = process.env.CHROMA_API_URL || 'http://localhost:8000';

async function testChromaConnection() {
  try {
    console.log('Testing ChromaDB connection...');
    console.log('ChromaDB URL:', CHROMA_API_URL);
    
    // Test 1: Get version
    console.log('\nTest 1: Checking ChromaDB version');
    const versionResponse = await fetch(`${CHROMA_API_URL}/api/v2/version`);
    if (!versionResponse.ok) {
      throw new Error(`Failed to get version: ${versionResponse.statusText}`);
    }
    const version = await versionResponse.text();
    console.log('ChromaDB version:', version);
    
    // Test 2: List collections
    console.log('\nTest 2: Listing collections');
    const listResponse = await fetch(`${CHROMA_API_URL}/api/v2/collections`);
    
    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      throw new Error(`Failed to list collections: ${errorText}`);
    }
    
    const collections = await listResponse.json();
    console.log('Collections:', JSON.stringify(collections, null, 2));
    
    console.log('\nAll tests passed! ChromaDB connection is working correctly.');
    return true;
  } catch (error) {
    console.error('Error testing ChromaDB connection:', error);
    return false;
  }
}

// Run the test
testChromaConnection()
  .then(success => {
    if (success) {
      console.log('✅ ChromaDB connection test successful!');
      process.exit(0);
    } else {
      console.error('❌ ChromaDB connection test failed!');
      process.exit(1);
    }
  });
