#!/usr/bin/env python3
"""
Test script to verify that the development environment is set up correctly.
This script checks for required dependencies and tests basic functionality.
"""

import os
import sys
import importlib
import requests
from pathlib import Path

# Define colors for terminal output
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
RED = '\033[0;31m'
NC = '\033[0m'  # No Color

def print_status(message, status):
    """Print a status message with color."""
    if status == "OK":
        print(f"{message}: {GREEN}OK{NC}")
    elif status == "WARNING":
        print(f"{message}: {YELLOW}WARNING{NC}")
    elif status == "ERROR":
        print(f"{message}: {RED}ERROR{NC}")
    else:
        print(f"{message}: {status}")

def check_python_version():
    """Check if Python version is 3.8 or higher."""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print_status("Python version", "OK")
    else:
        print_status(f"Python version (found {version.major}.{version.minor}, need 3.8+)", "ERROR")
        return False
    return True

def check_dependencies():
    """Check if required Python packages are installed."""
    required_packages = [
        "fastapi",
        "uvicorn",
        "pydantic",
        "qdrant_client",
        "python-multipart",
        "python-docx",
        "PyPDF2",
        "transformers",
        "sentence-transformers",
        "torch",
        "python-jose",
        "passlib",
        "python-dotenv",
        "tqdm",
        "numpy",
        "pandas"
    ]
    
    all_ok = True
    for package in required_packages:
        try:
            importlib.import_module(package.replace("-", "_"))
            print_status(f"Package: {package}", "OK")
        except ImportError:
            print_status(f"Package: {package}", "ERROR")
            all_ok = False
    
    return all_ok

def check_directories():
    """Check if required directories exist."""
    required_dirs = [
        "app",
        "app/api",
        "app/auth",
        "app/document_processing",
        "app/query_processing",
        "app/summarization",
        "app/frontend",
        "data",
        "data/raw",
        "podman",
        "scripts"
    ]
    
    all_ok = True
    for directory in required_dirs:
        if os.path.isdir(directory):
            print_status(f"Directory: {directory}", "OK")
        else:
            print_status(f"Directory: {directory}", "ERROR")
            all_ok = False
    
    return all_ok

def check_sample_data():
    """Check if sample data files exist."""
    sample_files = [
        "data/raw/financial_policy_2023.txt",
        "data/raw/compliance_guidelines.txt",
        "data/raw/client_record_acme_corp.txt"
    ]
    
    all_ok = True
    for file_path in sample_files:
        if os.path.isfile(file_path):
            print_status(f"Sample file: {file_path}", "OK")
        else:
            print_status(f"Sample file: {file_path}", "ERROR")
            all_ok = False
    
    return all_ok

def check_api_service():
    """Check if the API service is running."""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print_status("API service", "OK")
            return True
        else:
            print_status(f"API service (status code: {response.status_code})", "ERROR")
            return False
    except requests.exceptions.RequestException:
        print_status("API service (not running)", "WARNING")
        return False

def main():
    """Run all checks."""
    print("Testing Financial Services Knowledge Base environment...\n")
    
    # Change to the project root directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(os.path.dirname(script_dir))
    
    checks = [
        check_python_version(),
        check_dependencies(),
        check_directories(),
        check_sample_data(),
        check_api_service()
    ]
    
    print("\nSummary:")
    if all(checks):
        print(f"{GREEN}All checks passed! The environment is set up correctly.{NC}")
    else:
        print(f"{YELLOW}Some checks failed. Please fix the issues before proceeding.{NC}")
    
    print("\nNext steps:")
    print("1. Start implementing Milestone 2: Document Processing Pipeline")
    print("2. Run the API service with: cd podman && podman-compose up")
    print("3. Open the frontend in your browser: http://localhost:3000")

if __name__ == "__main__":
    main()
