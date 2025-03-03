from typing import Dict, List, Optional

class User:
    """User model with role-based access control information."""
    def __init__(self, user_id: str, role: str, departments: List[str]):
        self.user_id = user_id
        self.role = role
        self.departments = departments
        
    def has_access_to_document(self, document_metadata: Dict) -> bool:
        """
        Check if the user has access to a document based on its metadata.
        
        This method will be implemented by developers in Milestone 4.
        """
        # Placeholder implementation - always returns True
        return True

class AuthService:
    """Service for handling authentication and authorization."""
    
    def __init__(self):
        # Placeholder for user database
        self.users = {
            "user1": User("user1", "analyst", ["finance"]),
            "user2": User("user2", "manager", ["compliance"]),
            "user3": User("user3", "executive", ["finance", "compliance", "operations"])
        }
    
    def get_user(self, user_id: str) -> Optional[User]:
        """
        Get a user by ID.
        
        Args:
            user_id: The ID of the user to retrieve
            
        Returns:
            User object if found, None otherwise
        """
        return self.users.get(user_id)
    
    def filter_documents_by_access(self, user: User, documents: List[Dict]) -> List[Dict]:
        """
        Filter a list of documents based on user access permissions.
        
        This method will be implemented by developers in Milestone 4.
        
        Args:
            user: The user requesting access
            documents: List of document dictionaries with metadata
            
        Returns:
            Filtered list of documents the user has access to
        """
        # Placeholder implementation - returns all documents
        return documents

# Create a singleton instance
auth_service = AuthService()
