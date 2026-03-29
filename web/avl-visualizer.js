(function (globalScope) {
  "use strict";

  var HORIZONTAL_GAP = 96;
  var VERTICAL_GAP = 120;
  var NODE_RADIUS = 24;

  function parseInput(raw) {
    if (typeof raw !== "string") {
      throw new Error("Input must be a string of integers.");
    }

    var tokens = raw
      .split(/[\s,]+/)
      .map(function (token) {
        return token.trim();
      })
      .filter(Boolean);

    if (tokens.length === 0) {
      return [];
    }

    return tokens.map(function (token) {
      if (!/^-?\d+$/.test(token)) {
        throw new Error("Only integers separated by spaces or commas are supported.");
      }
      return Number(token);
    });
  }

  function createNode(value) {
    return {
      value: value,
      height: 1,
      left: null,
      right: null,
    };
  }

  function getHeight(node) {
    return node ? node.height : 0;
  }

  function updateHeight(node) {
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    return node;
  }

  function getBalance(node) {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
  }

  function rotateRight(node, steps) {
    var child = node.left;
    var movedSubtree = child.right;

    child.right = node;
    node.left = movedSubtree;

    updateHeight(node);
    updateHeight(child);

    if (steps) {
      steps.push("Rotate right at " + node.value + ".");
    }

    return child;
  }

  function rotateLeft(node, steps) {
    var child = node.right;
    var movedSubtree = child.left;

    child.left = node;
    node.right = movedSubtree;

    updateHeight(node);
    updateHeight(child);

    if (steps) {
      steps.push("Rotate left at " + node.value + ".");
    }

    return child;
  }

  function rebalance(node, insertedValue, steps) {
    var balance = getBalance(node);

    if (balance > 1) {
      if (insertedValue < node.left.value) {
        if (steps) {
          steps.push("LL imbalance detected at " + node.value + ".");
        }
        return rotateRight(node, steps);
      }

      if (steps) {
        steps.push("LR imbalance detected at " + node.value + ".");
        steps.push("Rotate left at " + node.left.value + " before rotating right.");
      }
      node.left = rotateLeft(node.left, null);
      updateHeight(node.left);
      return rotateRight(node, steps);
    }

    if (balance < -1) {
      if (insertedValue > node.right.value) {
        if (steps) {
          steps.push("RR imbalance detected at " + node.value + ".");
        }
        return rotateLeft(node, steps);
      }

      if (steps) {
        steps.push("RL imbalance detected at " + node.value + ".");
        steps.push("Rotate right at " + node.right.value + " before rotating left.");
      }
      node.right = rotateRight(node.right, null);
      updateHeight(node.right);
      return rotateLeft(node, steps);
    }

    return node;
  }

  function insertNode(node, value, steps) {
    if (!node) {
      if (steps) {
        steps.push("Insert " + value + " as a new node.");
      }
      return createNode(value);
    }

    if (value < node.value) {
      node.left = insertNode(node.left, value, steps);
    } else if (value > node.value) {
      node.right = insertNode(node.right, value, steps);
    } else {
      if (steps) {
        steps.push("Skip duplicate value " + value + ".");
      }
      return node;
    }

    updateHeight(node);
    return rebalance(node, value, steps);
  }

  function buildAVLSession(values) {
    var root = null;
    var steps = [];

    values.forEach(function (value) {
      root = insertNode(root, value, steps);
    });

    return { root: root, steps: steps };
  }

  function buildAVLTree(values) {
    return buildAVLSession(values).root;
  }

  function inOrder(node, result) {
    result = result || [];
    if (!node) {
      return result;
    }
    inOrder(node.left, result);
    result.push(node.value);
    inOrder(node.right, result);
    return result;
  }

  function preOrder(node, result) {
    result = result || [];
    if (!node) {
      return result;
    }
    result.push(node.value);
    preOrder(node.left, result);
    preOrder(node.right, result);
    return result;
  }

  function computeLayout(root) {
    var nodes = [];
    var edges = [];
    var index = 0;
    var nextId = 1;

    function walk(node, depth) {
      if (!node) {
        return null;
      }

      var leftNode = walk(node.left, depth + 1);
      var descriptor = {
        id: nextId++,
        value: node.value,
        height: node.height,
        balance: getBalance(node),
        x: 80 + index * HORIZONTAL_GAP,
        y: 80 + depth * VERTICAL_GAP,
        depth: depth,
      };
      index += 1;
      nodes.push(descriptor);

      var rightNode = walk(node.right, depth + 1);

      if (leftNode) {
        edges.push({ from: descriptor.id, to: leftNode.id });
      }
      if (rightNode) {
        edges.push({ from: descriptor.id, to: rightNode.id });
      }

      return descriptor;
    }

    var rootNode = walk(root, 0);
    var width = nodes.length === 0 ? 320 : 160 + (nodes.length - 1) * HORIZONTAL_GAP;
    var maxDepth = nodes.reduce(function (depth, node) {
      return Math.max(depth, node.depth);
    }, 0);
    var height = nodes.length === 0 ? 240 : 180 + maxDepth * VERTICAL_GAP;

    return {
      root: rootNode,
      nodes: nodes,
      edges: edges,
      width: width,
      height: height,
    };
  }

  function createSvgNode(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
  }

  function renderTree(svg, root) {
    var layout = computeLayout(root);
    var byId = {};

    layout.nodes.forEach(function (node) {
      byId[node.id] = node;
    });

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    svg.setAttribute("viewBox", "0 0 " + layout.width + " " + layout.height);

    if (!root) {
      var empty = createSvgNode("text");
      empty.setAttribute("x", "50%");
      empty.setAttribute("y", "50%");
      empty.setAttribute("text-anchor", "middle");
      empty.setAttribute("fill", "#8f5f4d");
      empty.setAttribute("font-size", "24");
      empty.textContent = "Enter integers to build an AVL tree.";
      svg.appendChild(empty);
      return layout;
    }

    layout.edges.forEach(function (edge) {
      var from = byId[edge.from];
      var to = byId[edge.to];
      var line = createSvgNode("line");
      line.setAttribute("x1", from.x);
      line.setAttribute("y1", from.y);
      line.setAttribute("x2", to.x);
      line.setAttribute("y2", to.y);
      line.setAttribute("stroke", "#77564a");
      line.setAttribute("stroke-width", "3");
      line.setAttribute("stroke-linecap", "round");
      svg.appendChild(line);
    });

    layout.nodes.forEach(function (node) {
      var group = createSvgNode("g");
      group.setAttribute("transform", "translate(" + node.x + "," + node.y + ")");

      var circle = createSvgNode("circle");
      circle.setAttribute("r", String(NODE_RADIUS));
      circle.setAttribute("fill", "#f9f3eb");
      circle.setAttribute("stroke", "#3d2b1f");
      circle.setAttribute("stroke-width", "3");
      group.appendChild(circle);

      var valueText = createSvgNode("text");
      valueText.setAttribute("text-anchor", "middle");
      valueText.setAttribute("dy", "6");
      valueText.setAttribute("fill", "#22170f");
      valueText.setAttribute("font-size", "18");
      valueText.setAttribute("font-weight", "700");
      valueText.textContent = String(node.value);
      group.appendChild(valueText);

      var metaText = createSvgNode("text");
      metaText.setAttribute("text-anchor", "middle");
      metaText.setAttribute("dy", "42");
      metaText.setAttribute("fill", "#6b4e40");
      metaText.setAttribute("font-size", "13");
      metaText.textContent = "h=" + node.height + " bf=" + node.balance;
      group.appendChild(metaText);

      svg.appendChild(group);
    });

    return layout;
  }

  function updateList(element, items) {
    element.innerHTML = "";
    items.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      element.appendChild(li);
    });
  }

  function renderApp(values, dom) {
    var session = buildAVLSession(values);
    var root = session.root;
    var layout = renderTree(dom.treeSvg, root);

    dom.nodeCount.textContent = String(layout.nodes.length);
    dom.rootValue.textContent = root ? String(root.value) : "-";
    dom.treeHeight.textContent = root ? String(root.height) : "0";
    dom.inorderOutput.textContent = inOrder(root).join(" ");
    dom.preorderOutput.textContent = preOrder(root).join(" ");

    if (session.steps.length === 0) {
      updateList(dom.stepList, ["No insertions yet."]);
    } else {
      updateList(dom.stepList, session.steps);
    }
  }

  function initVisualizer() {
    if (typeof document === "undefined") {
      return;
    }

    var input = document.getElementById("value-input");
    var submit = document.getElementById("render-button");
    var reset = document.getElementById("sample-button");
    var errorBox = document.getElementById("error-message");
    var dom = {
      treeSvg: document.getElementById("tree-svg"),
      stepList: document.getElementById("step-list"),
      inorderOutput: document.getElementById("inorder-output"),
      preorderOutput: document.getElementById("preorder-output"),
      nodeCount: document.getElementById("node-count"),
      rootValue: document.getElementById("root-value"),
      treeHeight: document.getElementById("tree-height"),
    };

    function renderFromInput() {
      try {
        var values = parseInput(input.value);
        errorBox.textContent = "";
        renderApp(values, dom);
      } catch (error) {
        errorBox.textContent = error.message;
      }
    }

    submit.addEventListener("click", renderFromInput);
    reset.addEventListener("click", function () {
      input.value = "30 20 10 25 40 35 50";
      renderFromInput();
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        renderFromInput();
      }
    });

    renderFromInput();
  }

  var api = {
    parseInput: parseInput,
    buildAVLTree: buildAVLTree,
    buildAVLSession: buildAVLSession,
    computeLayout: computeLayout,
    inOrder: inOrder,
    preOrder: preOrder,
    initVisualizer: initVisualizer,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.AVLVisualizer = api;

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initVisualizer);
    } else {
      initVisualizer();
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
