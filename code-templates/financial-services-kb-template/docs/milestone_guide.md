# Financial Services Knowledge Base - Milestone Guide

This guide provides detailed instructions for each development milestone. Follow these steps to implement a complete AI-powered knowledge base for financial services.

## Milestone 1: Development Environment Setup (Completed)

This milestone has been completed for you. The development environment includes:

- Containerized services using Podman
- Basic project structure
- Sample data
- Skeleton code for all components

You can verify the environment is set up correctly by running:

```bash
# For macOS/Linux
python3 scripts/test_environment.py

# For Windows
python scripts\test_environment.py
```

## Milestone 2: Document Processing Pipeline

In this milestone, you'll implement the document ingestion and processing system. This is the foundation of the knowledge base, as it extracts text from documents and generates embeddings for vector search.

### Tasks

1. **Implement Text Extraction**

   - Open `app/document_processing/document_processor.py`
   - Implement the `extract_text` method to handle different file formats (TXT, PDF, DOCX)
   - Use the appropriate libraries (PyPDF2, python-docx) to extract text

2. **Implement Document Processing**

   - Implement the `process_document` method to extract content and metadata
   - Parse document headers and sections
   - Identify access control information (e.g., "CONFIDENTIAL", "RESTRICTED ACCESS")

3. **Implement Embedding Generation**

   - Implement the `generate_embeddings` method using sentence-transformers
   - Choose an appropriate model for financial text (e.g., "all-MiniLM-L6-v2")
   - Generate embeddings for document chunks

4. **Implement Batch Processing**
   - Implement the `process_all_documents` method to process all documents in the raw directory
   - Save processed documents and embeddings to the appropriate directories

### Example Implementation

Here's an example of how to implement text extraction:

```python
def extract_text(self, file_path: str) -> str:
    """
    Extract text from a document file.

    Args:
        file_path: Path to the document file

    Returns:
        Extracted text content
    """
    file_extension = os.path.splitext(file_path)[1].lower()

    if file_extension == '.txt':
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()

    elif file_extension == '.pdf':
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num in range(len(pdf_reader.pages)):
                text += pdf_reader.pages[page_num].extract_text() + "\n"
        return text

    elif file_extension == '.docx':
        doc = DocxDocument(file_path)
        return "\n".join([para.text for para in doc.paragraphs])

    else:
        raise ValueError(f"Unsupported file format: {file_extension}")
```

### Testing

To test your implementation:

1. Run the document processor on the sample data:

```python
from app.document_processing.document_processor import document_processor

# Process all documents
documents = document_processor.process_all_documents()

# Print the results
for doc in documents:
    print(f"Document: {doc['title']}")
    print(f"Content length: {len(doc['content'])}")
    print(f"Metadata: {doc['metadata']}")
    print(f"Embedding shape: {len(doc['embedding'])}")
    print("---")
```

2. Verify that:
   - Text is correctly extracted from all document formats
   - Metadata is correctly identified
   - Embeddings are generated with the expected dimensions

## Milestone 3: Basic Query Processing

In this milestone, you'll implement the query processing system that allows users to search for relevant documents using natural language queries.

### Tasks

1. **Implement Query Embedding Generation**

   - Open `app/query_processing/query_processor.py`
   - Implement the `generate_query_embedding` method using the same model as for documents
   - Ensure the embedding dimensions match the document embeddings

2. **Implement Vector Database Integration**

   - Initialize the Qdrant client in the `__init__` method
   - Create a collection for document embeddings if it doesn't exist
   - Implement the `search_vector_db` method to search for similar documents

3. **Implement Query Processing**
   - Implement the `process_query` method to handle natural language queries
   - Generate query embeddings and search the vector database
   - Format and return the search results

### Example Implementation

Here's an example of how to implement vector database integration:

```python
def __init__(self, vector_db_host: str = "vector_db", vector_db_port: int = 6333):
    """
    Initialize the query processor.

    Args:
        vector_db_host: Hostname of the vector database
        vector_db_port: Port of the vector database
    """
    self.vector_db_host = vector_db_host
    self.vector_db_port = vector_db_port

    # Initialize the vector database client
    from qdrant_client import QdrantClient
    self.vector_db_client = QdrantClient(host=vector_db_host, port=vector_db_port)

    # Create a collection if it doesn't exist
    from qdrant_client.models import VectorParams, Distance
    try:
        self.vector_db_client.get_collection("documents")
    except Exception:
        # Collection doesn't exist, create it
        self.vector_db_client.create_collection(
            collection_name="documents",
            vectors_config=VectorParams(size=384, distance=Distance.COSINE)
        )
```

### Testing

To test your implementation:

1. Make sure the vector database is running:

```bash
cd podman
podman-compose up -d
```

2. Run a test query:

```python
from app.query_processing.query_processor import query_processor

# Process a test query
results = query_processor.process_query(
    query_text="What are our lending practices?",
    user_id="user1",
    role="analyst"
)

# Print the results
for result in results:
    print(f"Document: {result['title']}")
    print(f"Score: {result['score']}")
    print(f"Content: {result['content'][:100]}...")
    print("---")
```

3. Verify that:
   - The query returns relevant documents
   - The results are ranked by relevance
   - The vector database is properly integrated

## Milestone 4: Authorization and Access Control

In this milestone, you'll implement role-based access control to ensure sensitive information is only accessible to authorized users.

### Tasks

1. **Implement User Authentication Simulation**

   - Open `app/auth/auth_service.py`
   - Enhance the `User` class with role-based access control
   - Implement the `has_access_to_document` method to check document access

2. **Implement Document Access Control**

   - Modify the document processor to extract access control information
   - Add access control metadata to documents
   - Implement the `filter_documents_by_access` method to filter search results

3. **Integrate Authorization with Query Processing**
   - Modify the query processor to use the authorization service
   - Filter search results based on user roles and permissions
   - Return only documents the user has access to

### Example Implementation

Here's an example of how to implement document access control:

```python
def has_access_to_document(self, document_metadata: Dict) -> bool:
    """
    Check if the user has access to a document based on its metadata.

    Args:
        document_metadata: Document metadata including access control information

    Returns:
        True if the user has access, False otherwise
    """
    # Get access level from document metadata
    access_level = document_metadata.get("access_level", "public")

    # Check if the document is public
    if access_level == "public":
        return True

    # Check if the user is an executive (has access to everything)
    if self.role == "executive":
        return True

    # Check if the document is restricted to a specific department
    document_department = document_metadata.get("department")
    if document_department and document_department in self.departments:
        return True

    # Check if the document is restricted but the user has the right role
    if access_level == "restricted" and self.role in ["manager", "executive"]:
        return True

    # By default, deny access
    return False
```

### Testing

To test your implementation:

1. Test access control with different user roles:

```python
from app.auth.auth_service import auth_service
from app.query_processing.query_processor import query_processor

# Test with an analyst (limited access)
results_analyst = query_processor.process_query(
    query_text="client information",
    user_id="user1",  # analyst
    role="analyst"
)

# Test with an executive (full access)
results_executive = query_processor.process_query(
    query_text="client information",
    user_id="user3",  # executive
    role="executive"
)

# Compare the results
print(f"Analyst results: {len(results_analyst)} documents")
print(f"Executive results: {len(results_executive)} documents")
```

2. Verify that:
   - Different users see different results based on their roles
   - Sensitive documents are only accessible to authorized users
   - Public documents are accessible to all users

## Milestone 5: Document Summarization and Complete System

In this milestone, you'll implement document summarization and integrate all components into a complete system.

### Tasks

1. **Implement Document Summarization**

   - Open `app/summarization/summarizer.py`
   - Implement the `summarize` method using transformers
   - Implement the `generate_contextual_summary` method for query-focused summaries

2. **Enhance Response Formatting**

   - Modify the API to include document summaries in responses
   - Format responses to highlight relevant sections
   - Add metadata to help users understand document context

3. **Integrate All Components**
   - Connect the document processing, query processing, authorization, and summarization components
   - Ensure the complete system works end-to-end
   - Optimize performance and user experience

### Example Implementation

Here's an example of how to implement document summarization:

```python
def summarize(self, document: Dict) -> str:
    """
    Generate a summary for a document.

    Args:
        document: Document dictionary with content

    Returns:
        Summary text
    """
    from transformers import pipeline

    # Initialize the summarization model if not already done
    if self.model is None:
        self.model = pipeline("summarization", model="facebook/bart-large-cnn")

    # Get the document content
    content = document.get("content", "")

    # If the content is short, return it as is
    if len(content) < 200:
        return content

    # Generate a summary
    summary = self.model(content, max_length=150, min_length=50, do_sample=False)

    return summary[0]["summary_text"]
```

### Testing

To test your implementation:

1. Test the complete system with a query:

```python
from app.api.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

# Test a query
response = client.post(
    "/query",
    json={
        "text": "What are our lending practices?",
        "user_id": "user3",
        "role": "executive"
    }
)

# Print the results
data = response.json()
for doc in data["documents"]:
    print(f"Document: {doc['title']}")
    print(f"Summary: {doc['summary']}")
    print(f"Content: {doc['content'][:100]}...")
    print("---")
```

2. Verify that:
   - The system returns relevant documents with summaries
   - The summaries accurately capture the document content
   - The complete system works end-to-end with all features

## Conclusion

Congratulations on completing all milestones! You've built a complete AI-powered knowledge base for financial services with:

- Document processing and embedding generation
- Natural language query processing
- Role-based access control
- Document summarization

This system demonstrates how AI can be used to improve information access and security in financial services organizations.
