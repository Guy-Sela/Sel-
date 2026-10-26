#!/bin/sh
# Purpose: commit deliberately staged changes on main and trigger deployment.
# Input: staged files and a commit message. Output: a commit pushed to origin/main.
# Run with: git add <chosen-files>, then npm run deploy -- "your message".
# GitHub Actions builds and deploys the pushed commit; unstaged files stay local.
set -eu

if [ "$(git branch --show-current)" != "main" ]; then
  echo "Error: deployment must run from main. No changes were committed."
  exit 1
fi

if [ "$#" -ne 1 ] || [ -z "$1" ]; then
  echo "Usage: npm run deploy -- \"your message\""
  exit 1
fi

if git diff --cached --quiet; then
  echo "Error: no changes staged. Use git add with the specific files to deploy."
  exit 1
fi

npm run security:check

GIT_EDITOR=true git commit -m "$1"
git push origin main
echo "Pushed main. GitHub Actions will build and deploy the site."
