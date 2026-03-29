(function (global) {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const CONFIG = {
    radius: 22,
    horizontalGap: 88,
    verticalGap: 96,
    paddingX: 56,
    paddingY: 52,
    minWidth: 420,
    minHeight: 240,
  };

  function AVLNode(value) {
    this.value = value;
    this.height = 1;
    this.left = null;
    this.right = null;
  }

  function nodeHeight(node) {
    return node ? node.height : 0;
  }

  function updateHeight(node) {
    node.height = Math.max(nodeHeight(node.left), nodeHeight(node.right)) + 1;
  }

  function balanceFactor(node) {
    return node ? nodeHeight(node.left) - nodeHeight(node.right) : 0;
  }

  function rotateRight(root) {
    const pivot = root.left;
    const transfer = pivot.right;
    pivot.right = root;
    root.left = transfer;
    updateHeight(root);
    updateHeight(pivot);
    return pivot;
  }

  function rotateLeft(root) {
    const pivot = root.right;
    const transfer = pivot.left;
    pivot.left = root;
    root.right = transfer;
    updateHeight(root);
    updateHeight(pivot);
    return pivot;
  }

  function rebalance(root) {
    updateHeight(root);
    const balance = balanceFactor(root);

    if (balance > 1) {
      if (balanceFactor(root.left) < 0) {
        root.left = rotateLeft(root.left);
      }
      return rotateRight(root);
    }

    if (balance < -1) {
      if (balanceFactor(root.right) > 0) {
        root.right = rotateRight(root.right);
      }
      return rotateLeft(root);
    }

    return root;
  }

  function insertNode(root, value) {
    if (!root) {
      return new AVLNode(value);
    }

    if (value < root.value) {
      root.left = insertNode(root.left, value);
    } else if (value > root.value) {
      root.right = insertNode(root.right, value);
    } else {
      return root;
    }

    return rebalance(root);
  }

  function buildAVLTree(values) {
    let root = null;
    values.forEach((value) => {
      if (!Number.isInteger(value)) {
        throw new Error(`Invalid integer value: ${value}`);
      }
      root = insertNode(root, value);
    });
    return root;
  }

  function inOrder(node, output) {
    const result = output || [];
    if (!node) {
      return result;
    }
    inOrder(node.left, result);
    result.push(node.value);
    inOrder(node.right, result);
    return result;
  }

  function preOrder(node, output) {
    const result = output || [];
    if (!node) {
      return result;
    }
    result.push(node.value);
    preOrder(node.left, result);
    preOrder(node.right, result);
    return result;
  }

  function countNodes(node) {
    if (!node) {
      return 0;
    }
    return 1 + countNodes(node.left) + countNodes(node.right);
  }

  function treeDepth(node) {
    if (!node) {
      return 0;
    }
    return 1 + Math.max(treeDepth(node.left), treeDepth(node.right));
  }

  function computeLayout(root) {
    if (!root) {
      return {
        nodes: [],
        edges: [],
        width: CONFIG.minWidth,
        height: CONFIG.minHeight,
      };
    }

    const positions = new Map();
    const nodes = [];
    const edges = [];
    let cursor = 0;
    let maxDepth = 0;

    function assign(node, depth) {
      if (!node) {
        return;
      }
      assign(node.left, depth + 1);
      positions.set(node, {
        x: CONFIG.paddingX + cursor * CONFIG.horizontalGap,
        y: CONFIG.paddingY + depth * CONFIG.verticalGap,
        depth,
      });
      cursor += 1;
      maxDepth = Math.max(maxDepth, depth);
      assign(node.right, depth + 1);
    }

    function collect(node) {
      if (!node) {
        return;
      }

      const own = positions.get(node);
      nodes.push({
        value: node.value,
        height: node.height,
        balance: balanceFactor(node),
        x: own.x,
        y: own.y,
        depth: own.depth,
      });

      if (node.left) {
        const left = positions.get(node.left);
        edges.push({
          fromX: own.x,
          fromY: own.y,
          toX: left.x,
          toY: left.y,
        });
        collect(node.left);
      }

      if (node.right) {
        const right = positions.get(node.right);
        edges.push({
          fromX: own.x,
          fromY: own.y,
          toX: right.x,
          toY: right.y,
        });
        collect(node.right);
      }
    }

    assign(root, 0);
    collect(root);

    return {
      nodes,
      edges,
      width: Math.max(CONFIG.minWidth, CONFIG.paddingX * 2 + Math.max(0, cursor - 1) * CONFIG.horizontalGap),
      height: Math.max(CONFIG.minHeight, CONFIG.paddingY * 2 + maxDepth * CONFIG.verticalGap + CONFIG.radius * 2),
    };
  }

  function parseValues(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return [];
    }

    return trimmed
      .split(/[\s,]+/)
      .filter(Boolean)
      .map((token) => {
        if (!/^-?\d+$/.test(token)) {
          throw new Error(`"${token}" 不是有效整数`);
        }
        return Number(token);
      });
  }

  function clearChildren(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function appendSvgElement(parent, name, attributes) {
    const element = parent.ownerDocument.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });
    parent.appendChild(element);
    return element;
  }

  function renderEmptyState(svg) {
    svg.setAttribute('viewBox', `0 0 ${CONFIG.minWidth} ${CONFIG.minHeight}`);
    appendSvgElement(svg, 'text', {
      x: CONFIG.minWidth / 2,
      y: CONFIG.minHeight / 2,
      'text-anchor': 'middle',
      'font-size': 18,
      fill: '#4a5d4f',
    }).textContent = '输入整数后点击 Render Tree';
  }

  function renderTree(svg, layout) {
    clearChildren(svg);

    if (!layout.nodes.length) {
      renderEmptyState(svg);
      return;
    }

    svg.setAttribute('viewBox', `0 0 ${layout.width} ${layout.height}`);

    layout.edges.forEach((edge) => {
      appendSvgElement(svg, 'line', {
        x1: edge.fromX,
        y1: edge.fromY,
        x2: edge.toX,
        y2: edge.toY,
        stroke: '#5b6b5f',
        'stroke-width': 3,
        'stroke-linecap': 'round',
      });
    });

    layout.nodes.forEach((node) => {
      const group = appendSvgElement(svg, 'g', {
        transform: `translate(${node.x}, ${node.y})`,
      });
      appendSvgElement(group, 'circle', {
        r: CONFIG.radius,
        fill: '#fef7e8',
        stroke: '#203629',
        'stroke-width': 3,
      });
      appendSvgElement(group, 'text', {
        x: 0,
        y: 6,
        'text-anchor': 'middle',
        'font-size': 18,
        'font-weight': 700,
        fill: '#203629',
      }).textContent = String(node.value);
      appendSvgElement(group, 'text', {
        x: 0,
        y: CONFIG.radius + 20,
        'text-anchor': 'middle',
        'font-size': 12,
        fill: '#4b5f53',
      }).textContent = `h=${node.height} bf=${node.balance}`;
    });
  }

  function joinValues(values) {
    return values.length ? values.join(', ') : '（空）';
  }

  function bootstrap() {
    if (typeof document === 'undefined') {
      return;
    }

    const input = document.getElementById('sequence-input');
    const renderButton = document.getElementById('render-button');
    const resetButton = document.getElementById('reset-button');
    const sampleButton = document.getElementById('sample-button');
    const svg = document.getElementById('tree-svg');
    const sequenceOutput = document.getElementById('sequence-output');
    const nodeCount = document.getElementById('node-count');
    const treeHeightOutput = document.getElementById('tree-height');
    const inOrderOutput = document.getElementById('inorder-output');
    const preOrderOutput = document.getElementById('preorder-output');
    const errorBanner = document.getElementById('error-banner');

    if (!input || !renderButton || !resetButton || !sampleButton || !svg) {
      return;
    }

    function showError(message) {
      errorBanner.textContent = message;
      errorBanner.hidden = false;
    }

    function clearError() {
      errorBanner.textContent = '';
      errorBanner.hidden = true;
    }

    function updateOutputs(values) {
      try {
        clearError();
        const tree = buildAVLTree(values);
        const layout = computeLayout(tree);
        renderTree(svg, layout);
        sequenceOutput.textContent = joinValues(values);
        nodeCount.textContent = String(countNodes(tree));
        treeHeightOutput.textContent = String(treeDepth(tree));
        inOrderOutput.textContent = joinValues(inOrder(tree));
        preOrderOutput.textContent = joinValues(preOrder(tree));
      } catch (error) {
        renderTree(svg, { nodes: [], edges: [], width: CONFIG.minWidth, height: CONFIG.minHeight });
        sequenceOutput.textContent = '（无）';
        nodeCount.textContent = '0';
        treeHeightOutput.textContent = '0';
        inOrderOutput.textContent = '（无）';
        preOrderOutput.textContent = '（无）';
        showError(error.message);
      }
    }

    function renderFromInput() {
      updateOutputs(parseValues(input.value));
    }

    renderButton.addEventListener('click', renderFromInput);
    resetButton.addEventListener('click', () => {
      input.value = '';
      updateOutputs([]);
    });
    sampleButton.addEventListener('click', () => {
      input.value = '10 20 30 40 50 25';
      renderFromInput();
    });

    updateOutputs(parseValues(input.value));
  }

  const api = {
    AVLNode,
    balanceFactor,
    buildAVLTree,
    computeLayout,
    countNodes,
    inOrder,
    parseValues,
    preOrder,
    renderTree,
    treeDepth,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  global.AVLVisualizer = api;

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
      bootstrap();
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
