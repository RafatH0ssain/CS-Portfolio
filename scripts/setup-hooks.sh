#!/bin/sh
# Run once after cloning or creating the repo:   sh scripts/setup-hooks.sh
# Points git at the hooks in .githooks/ so that every push needs a person
# to type "push", and secrets or vault files cannot be committed.
set -e
cd "$(git rev-parse --show-toplevel)"
git config core.hooksPath .githooks
chmod +x .githooks/pre-push .githooks/pre-commit
echo "Git hooks installed: pre-push (asks you to confirm) and pre-commit (blocks secrets and vault files)."
