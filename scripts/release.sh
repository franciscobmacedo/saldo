#!/bin/bash
set -e

PRERELEASE=$1

# Get date in YYYY and MMDD formats.
# Note: npm version strips leading zeros, so technically 0225 becomes 225
# in the package.json, preventing errors with SemVer rules.
YYYY=$(date +'%Y')
MMDD=$(date +'%m%d')

# Force MMDD to not have leading zeros for the sake of npm/SemVer
# E.g., '0225' -> '225', '1105' -> '1105'
MMDD_NO_ZERO=$(echo $MMDD | sed 's/^0*//')

BASE_PREFIX="${YYYY}.${MMDD_NO_ZERO}"
echo "Base date prefix: $BASE_PREFIX"

# Fetch all tags
git fetch --tags --force

# Find all existing stable revisions for today (e.g., 2026.225.0, 2026.225.1)
LATEST_STABLE_REVISION=$(git tag -l "$BASE_PREFIX.*" | grep -v 'beta' | grep -oE '[0-9]+$' | sort -n | tail -1)

if [ "$PRERELEASE" = "true" ]; then
  # Prerelease flow
  
  # If no stable release exists today, we use revision 0.
  # Otherwise, we use the CURRENT highest stable revision, because we are 
  # preparing a beta for the NEXT revision if we need a hotfix later.
  if [ -z "$LATEST_STABLE_REVISION" ]; then
    TARGET_REVISION=0
  else
    # e.g., if .0 exists, we are making betas for .1
    TARGET_REVISION=$((LATEST_STABLE_REVISION + 1))
  fi
  
  # Find the highest beta index for this target revision
  LATEST_BETA=$(git tag -l "$BASE_PREFIX.$TARGET_REVISION-beta.*" | grep -oE '[0-9]+$' | sort -n | tail -1 || echo "")
  
  if [ -z "$LATEST_BETA" ]; then
    NEW_VERSION="$BASE_PREFIX.$TARGET_REVISION-beta.1"
  else
    NEW_VERSION="$BASE_PREFIX.$TARGET_REVISION-beta.$((LATEST_BETA + 1))"
  fi
  
  if [ -n "$GITHUB_OUTPUT" ]; then
    echo "is_prerelease=true" >> "$GITHUB_OUTPUT"
  fi
else
  # Stable release flow
  
  if [ -z "$LATEST_STABLE_REVISION" ]; then
    # First stable release of the day
    NEW_VERSION="$BASE_PREFIX.0"
  else
    # Hotfix on the same day Let's bump the revision
    NEW_VERSION="$BASE_PREFIX.$((LATEST_STABLE_REVISION + 1))"
  fi
  
  if [ -n "$GITHUB_OUTPUT" ]; then
    echo "is_prerelease=false" >> "$GITHUB_OUTPUT"
  fi
fi

echo "Determined version: $NEW_VERSION"

# Update package.json
npm version "$NEW_VERSION" --no-git-tag-version --allow-same-version

if [ -n "$GITHUB_OUTPUT" ]; then
  echo "new_version=$NEW_VERSION" >> "$GITHUB_OUTPUT"
  echo "version_number=$NEW_VERSION" >> "$GITHUB_OUTPUT"
fi
