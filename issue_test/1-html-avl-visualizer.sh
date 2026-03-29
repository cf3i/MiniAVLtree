#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
HTML_FILE="$ROOT_DIR/web/avl-visualizer.html"
JS_FILE="$ROOT_DIR/web/avl-visualizer.js"

if [[ ! -f "$HTML_FILE" ]]; then
    echo "FAIL: expected HTML visualizer page at $HTML_FILE" >&2
    echo "Expected: a browser entry page for the AVL visualizer issue." >&2
    echo "Actual: file does not exist yet." >&2
    exit 1
fi

if [[ ! -f "$JS_FILE" ]]; then
    echo "FAIL: expected visualizer script at $JS_FILE" >&2
    echo "Expected: a JavaScript module implementing AVL build/render helpers." >&2
    echo "Actual: file does not exist yet." >&2
    exit 1
fi

if ! grep -q "avl-visualizer.js" "$HTML_FILE"; then
    echo "FAIL: expected $HTML_FILE to reference avl-visualizer.js" >&2
    echo "Expected: HTML page loads the visualizer script." >&2
    echo "Actual: script reference missing." >&2
    exit 1
fi

node <<'EOF'
const path = require("path");
const visualizer = require(path.join(process.cwd(), "web", "avl-visualizer.js"));

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

if (typeof visualizer.parseInput !== "function") {
  fail("expected parseInput() export");
}
if (typeof visualizer.buildAVLTree !== "function") {
  fail("expected buildAVLTree() export");
}
if (typeof visualizer.computeLayout !== "function") {
  fail("expected computeLayout() export");
}

const parsed = visualizer.parseInput("30, 20 10");
if (JSON.stringify(parsed) !== JSON.stringify([30, 20, 10])) {
  fail(`parseInput returned ${JSON.stringify(parsed)} instead of [30,20,10]`);
}

const root = visualizer.buildAVLTree([30, 20, 10]);
if (!root || root.value !== 20) {
  fail(`expected LL rotation to produce root value 20, got ${root ? root.value : "null"}`);
}
if (!root.left || root.left.value !== 10 || !root.right || root.right.value !== 30) {
  fail("expected rotated tree children to be 10 and 30");
}

const rrRoot = visualizer.buildAVLTree([10, 20, 30]);
if (!rrRoot || rrRoot.value !== 20) {
  fail(`expected RR rotation to produce root value 20, got ${rrRoot ? rrRoot.value : "null"}`);
}

const layout = visualizer.computeLayout(root);
if (!layout || !Array.isArray(layout.nodes) || !Array.isArray(layout.edges)) {
  fail("computeLayout should return { nodes, edges }");
}
if (layout.nodes.length !== 3 || layout.edges.length !== 2) {
  fail(`expected layout for 3-node tree to contain 3 nodes and 2 edges, got ${layout.nodes.length} nodes and ${layout.edges.length} edges`);
}
if (!layout.nodes.every((node) => typeof node.x === "number" && typeof node.y === "number")) {
  fail("expected every layout node to contain numeric x/y coordinates");
}

console.log("Visualizer logic PASS");
EOF
