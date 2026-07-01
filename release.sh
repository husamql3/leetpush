#!/usr/bin/env bash
# Usage:
#   ./release.sh <version>  — bump version, commit, tag, and push (triggers CI)
#   ./release.sh            — build popup and create a local zip for testing
#
# Example: ./release.sh 1.8.1
set -e

make_zip() {
  local version
  version=$(node -p "require('./manifest.json').version")
  local zip_name="leetpush-${version}.zip"

  cd popup && bun run build && cd ..

  zip -r "${zip_name}" \
    manifest.json \
    background.js \
    content-script.js \
    style.css \
    images/ \
    dist/ \
    assets/ \
    --exclude "*.DS_Store"

  echo "✓ Created ${zip_name}"
}

if [ -z "$1" ]; then
  make_zip
  exit 0
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
