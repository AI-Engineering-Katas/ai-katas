#!/bin/bash

# Directory to process
DIR=$1

# Check if directory is provided
if [ -z "$DIR" ]; then
  echo "Usage: $0 <directory>"
  exit 1
fi

# Find and process each file in the directory
find "$DIR" -type f -name "*.md" | while read -r FILE; do
  # Use sed to delete everything between <!-- and -->
  sed -i '' '/<!--/,/-->/d' "$FILE"
done

echo "Processing complete."