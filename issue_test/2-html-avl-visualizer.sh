#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
HTML_FILE="$ROOT_DIR/web/avl-visualizer.html"
JS_FILE="$ROOT_DIR/web/avl-visualizer.js"

fail() {
    echo "FAIL: $*" >&2
    exit 1
}

[[ -f "$HTML_FILE" ]] || fail "expected $HTML_FILE to exist"
[[ -f "$JS_FILE" ]] || fail "expected $JS_FILE to exist"

if ! rg -q 'id="tree-svg"' "$HTML_FILE"; then
    fail "expected HTML visualizer to contain an SVG mount with id=\"tree-svg\""
fi

if ! rg -q 'AVLVisualizer' "$JS_FILE"; then
    fail "expected JS module to expose AVLVisualizer API"
fi

cd "$ROOT_DIR"
node <<'NODE'
const api = require('./web/avl-visualizer.js');

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

assert(typeof api.buildAVLTree === 'function', 'buildAVLTree should be exported');
assert(typeof api.inOrder === 'function', 'inOrder should be exported');
assert(typeof api.preOrder === 'function', 'preOrder should be exported');
assert(typeof api.computeLayout === 'function', 'computeLayout should be exported');

const values = [10, 20, 30, 40, 50, 25];
const tree = api.buildAVLTree(values);

assert(tree && tree.value === 30, `expected root value 30, got ${tree ? tree.value : 'null'}`);
assert(api.inOrder(tree).join(',') === '10,20,25,30,40,50', 'unexpected in-order traversal');
assert(api.preOrder(tree).join(',') === '30,20,10,25,40,50', 'unexpected pre-order traversal');

const layout = api.computeLayout(tree);
assert(Array.isArray(layout.nodes), 'layout.nodes should be an array');
assert(Array.isArray(layout.edges), 'layout.edges should be an array');
assert(layout.nodes.length === 6, `expected 6 layout nodes, got ${layout.nodes.length}`);
assert(layout.edges.length === 5, `expected 5 layout edges, got ${layout.edges.length}`);
assert(layout.width >= 360, `expected layout width >= 360, got ${layout.width}`);
assert(layout.height >= 220, `expected layout height >= 220, got ${layout.height}`);
NODE
