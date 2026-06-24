#!/bin/sh
if [ -z "$1" ]; then
  echo "Error: Commit message required."
  echo "Usage: npm run deploy -- \"your message\""
  exit 1
fi

npm run build && \
git add . && \
git commit -m "$1" && \
git push
