#!/usr/bin/env bash
# Usage: ./release.sh <version>
#
# Bumps the version in manifest.json, commits it, creates a git tag,
# and pushes both to origin. GitHub Actions then builds and publishes
# the extension to the Chrome Web Store automatically.
#
# Example: ./release.sh 1.8.1
set -e

if [ -z "$1" ]; then
  echo "Usage: ./release.sh <version>  (e.g. ./release.sh 1.8.1)"
  exit 1
fi

VERSION="$1"
TAG="v${VERSION}"

# Bump version in manifest.json
node -e "
  const fs = require('fs');
  const m = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  m.version = '${VERSION}';
  fs.writeFileSync('manifest.json', JSON.stringify(m, null, '\t') + '\n');
"

echo "✓ manifest.json → ${VERSION}"

git add manifest.json
git commit -m "chore: release ${TAG}"
git tag "${TAG}"
git push origin master "${TAG}"

echo "✓ Tagged and pushed ${TAG} — GitHub Actions will handle the rest"
