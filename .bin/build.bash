#!/usr/bin/env bash
set -e
rm -rf ./dist
mkdir -p dist
tar --exclude='.git' --exclude='.env' --exclude='./dist/artifact.tar' --exclude='./.db' --exclude='./node_modules' --exclude='./.vscode' -czf ./dist/artifact.tar ./