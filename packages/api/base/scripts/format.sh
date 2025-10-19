#!/bin/sh -e
set -x

uv run ruff check orbitium --fix
uv run ruff format orbitium
