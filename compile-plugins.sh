#!/bin/bash
# Compile TypeScript plugins to JavaScript (if OpenCode requires .js)
# Usage: bash compile-plugins.sh

cd "$(dirname "$0")"

if command -v npx &> /dev/null; then
  npx tsc --outDir plugins-dist --rootDir plugins --module commonjs --target es2020 --esModuleInterop --resolveJsonModule plugins/*.ts plugins/lib/*.ts 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "Compiled to plugins-dist/"
  else
    echo "tsc failed, trying esbuild..."
    for f in plugins/*.ts; do
      npx esbuild "$f" --outdir=plugins-dist --format=cjs --platform=node 2>/dev/null
    done
    npx esbuild plugins/lib/common.ts --outdir=plugins-dist/lib --format=cjs --platform=node 2>/dev/null
    echo "Compiled with esbuild to plugins-dist/"
  fi
else
  echo "No npx found. Install Node.js first."
  exit 1
fi
