/**
 * Simple script to test ChromaDB API directly
 */

const CHROMA_API_URL = process.env.CHROMA_API_URL || 'http://localhost:8000';

async function testChromaAPI() {
  console.log('Testing ChromaDB API...');
  console.log('ChromaDB URL:', CHROMA_API_URL);
  
  try {
    // Test 1: Get version
    console.log('\nTest 1: Checking ChromaDB version');
    const versionResponse = await fetch(`${CHROMA_API_URL}/api/v1/version`);
    if (!versionResponse.ok) {
      console.log('V1 version endpoint failed, trying V2...');
      const v2VersionResponse = await fetch(`${CHROMA_API_URL}/api/v2/version`);
      if (!v2VersionResponse.ok) {
        throw new Error(`Failed to get version: ${v2VersionResponse.statusText}`);
      }
      const version = await v2VersionResponse.text();
      console.log('ChromaDB version (v2 API):', version);
    } else {
      const version = await versionResponse.text();
      console.log('ChromaDB version (v1 API):', version);
    }
    
    // Test 2: List collections
    console.log('\nTest 2: Listing collections');
    const listResponse = await fetch(`${CHROMA_API_URL}/api/v1/collections`);
    
    if (!listResponse.ok) {
      console.log('V1 collections endpoint failed, trying V2...');
      const v2ListResponse = await fetch(`${CHROMA_API_URL}/api/v2/collections`);
      if (!v2ListResponse.ok) {
        throw new Error(`Failed to list collections: ${v2ListResponse.statusText}`);
      }
      const collections = await v2ListResponse.json();
      console.log('Collections (v2 API):', JSON.stringify(collections, null, 2));
    } else {
      const collections = await listResponse.json();
      console.log('Collections (v1 API):', JSON.stringify(collections, null, 2));
    }
    
    console.log('\nAll tests passed! ChromaDB API is working correctly.');
    return true;
  } catch (error) {
    console.error('Error testing ChromaDB API:', error);
    return false;
  }
}

// Run the test
testChromaAPI()
  .then(success => {
    if (success) {
      console.log('✅ ChromaDB API test successful!');
      process.exit(0);
    } else {
      console.error('❌ ChromaDB API test failed!');
      process.exit(1);
    }
  });
