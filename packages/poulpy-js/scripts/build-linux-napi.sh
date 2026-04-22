#!/usr/bin/env bash
# Build the Linux Docker image, then copy napi/ from that image into this package (replaces napi/ contents).
# Usage: packages/poulpy-js/scripts/build-linux-napi.sh [image-tag]   default: poulpy-linux:local
set -euo pipefail
PKG_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$PKG_ROOT/../.." && pwd)"
IMG="${1:-poulpy-linux:local}"

echo "docker build: $REPO_ROOT -> $IMG"
docker build --platform=linux/amd64 -f "$PKG_ROOT/build-linux-napi.Dockerfile" -t "$IMG" "$REPO_ROOT"

echo "docker cp: $IMG napi/ -> $PKG_ROOT/napi/"
cd "$PKG_ROOT"
mkdir -p napi
cid=$(docker create "$IMG")
docker cp "$cid":/poulpy-js/packages/poulpy-js/napi/. napi/
docker rm "$cid" >/dev/null
echo "Done."
