"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getEditor: true,
  removeEditor: true,
  startOperation: true,
  endOperation: true,
  toEditorLine: true,
  fromEditorLine: true,
  toEditorPosition: true,
  toSourceLine: true,
  scrollToPosition: true,
  getLocationsInViewport: true,
  markText: true,
  lineAtHeight: true,
  getSourceLocationFromMouseEvent: true,
  forEachLine: true,
  removeLineClass: true,
  clearLineClass: true,
  getTextForLine: true,
  getCursorLine: true,
  getCursorColumn: true
};
exports.getEditor = getEditor;
exports.removeEditor = removeEditor;
exports.startOperation = startOperation;
exports.endOperation = endOperation;
exports.toEditorLine = toEditorLine;
exports.fromEditorLine = fromEditorLine;
exports.toEditorPosition = toEditorPosition;
exports.toSourceLine = toSourceLine;
exports.scrollToPosition = scrollToPosition;
exports.getLocationsInViewport = getLocationsInViewport;
exports.markText = markText;
exports.lineAtHeight = lineAtHeight;
exports.getSourceLocationFromMouseEvent = getSourceLocationFromMouseEvent;
exports.forEachLine = forEachLine;
exports.removeLineClass = removeLineClass;
exports.clearLineClass = clearLineClass;
exports.getTextForLine = getTextForLine;
exports.getCursorLine = getCursorLine;
exports.getCursorColumn = getCursorColumn;
loader.lazyRequireGetter(this, "_sourceDocuments", "devtools/client/debugger/src/utils/editor/source-documents");
Object.keys(_sourceDocuments).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sourceDocuments[key];
    }
  });
});
loader.lazyRequireGetter(this, "_sourceSearch", "devtools/client/debugger/src/utils/editor/source-search");
Object.keys(_sourceSearch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sourceSearch[key];
    }
  });
});
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/utils/ui");
Object.keys(_ui).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ui[key];
    }
  });
});
loader.lazyRequireGetter(this, "_tokens", "devtools/client/debugger/src/utils/editor/tokens");
Object.keys(_tokens).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tokens[key];
    }
  });
});
loader.lazyRequireGetter(this, "_createEditor", "devtools/client/debugger/src/utils/editor/create-editor");
loader.lazyRequireGetter(this, "_wasm", "devtools/client/debugger/src/utils/wasm");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
let editor;

function getEditor() {
  if (editor) {
    return editor;
  }

  editor = (0, _createEditor.createEditor)();
  return editor;
}

function removeEditor() {
  editor = null;
}

function getCodeMirror() {
  return editor && editor.hasCodeMirror ? editor.codeMirror : null;
}

function startOperation() {
  const codeMirror = getCodeMirror();

  if (!codeMirror) {
    return;
  }

  codeMirror.startOperation();
}

function endOperation() {
  const codeMirror = getCodeMirror();

  if (!codeMirror) {
    return;
  }

  codeMirror.endOperation();
}

function toEditorLine(sourceId, lineOrOffset) {
  if ((0, _wasm.isWasm)(sourceId)) {
    // TODO ensure offset is always "mappable" to edit line.
    return (0, _wasm.wasmOffsetToLine)(sourceId, lineOrOffset) || 0;
  }

  return lineOrOffset ? lineOrOffset - 1 : 1;
}

function fromEditorLine(sourceId, line, sourceIsWasm) {
  if (sourceIsWasm) {
    return (0, _wasm.lineToWasmOffset)(sourceId, line) || 0;
  }

  return line + 1;
}

function toEditorPosition(location) {
  // Note that Spidermonkey, Debugger frontend and CodeMirror are all consistant regarding column
  // and are 0-based. But only CodeMirror consider the line to be 0-based while the two others
  // consider lines to be 1-based.
  return {
    line: toEditorLine(location.source.id, location.line),
    column: (0, _wasm.isWasm)(location.source.id) || (!location.column ? 0 : location.column)
  };
}

function toSourceLine(sourceId, line) {
  return (0, _wasm.isWasm)(sourceId) ? (0, _wasm.lineToWasmOffset)(sourceId, line) : line + 1;
}

function scrollToPosition(codeMirror, line, column) {
  // For all cases where these are on the first line and column,
  // avoid the possibly slow computation of cursor location on large bundles.
  if (!line && !column) {
    codeMirror.scrollTo(0, 0);
    return;
  }

  const {
    top,
    left
  } = codeMirror.charCoords({
    line,
    ch: column
  }, "local");

  if (!isVisible(codeMirror, top, left)) {
    const scroller = codeMirror.getScrollerElement();
    const centeredX = Math.max(left - scroller.offsetWidth / 2, 0);
    const centeredY = Math.max(top - scroller.offsetHeight / 2, 0);
    codeMirror.scrollTo(centeredX, centeredY);
  }
}

function isVisible(codeMirror, top, left) {
  function withinBounds(x, min, max) {
    return x >= min && x <= max;
  }

  const scrollArea = codeMirror.getScrollInfo();
  const charWidth = codeMirror.defaultCharWidth();
  const fontHeight = codeMirror.defaultTextHeight();
  const {
    scrollTop,
    scrollLeft
  } = codeMirror.doc;
  const inXView = withinBounds(left, scrollLeft, scrollLeft + (scrollArea.clientWidth - 30) - charWidth);
  const inYView = withinBounds(top, scrollTop, scrollTop + scrollArea.clientHeight - fontHeight);
  return inXView && inYView;
}

function getLocationsInViewport({
  codeMirror
}, // Offset represents an allowance of characters or lines offscreen to improve
// perceived performance of column breakpoint rendering
offsetHorizontalCharacters = 100, offsetVerticalLines = 20) {
  // Get scroll position
  if (!codeMirror) {
    return {
      start: {
        line: 0,
        column: 0
      },
      end: {
        line: 0,
        column: 0
      }
    };
  }

  const charWidth = codeMirror.defaultCharWidth();
  const scrollArea = codeMirror.getScrollInfo();
  const {
    scrollLeft
  } = codeMirror.doc;
  const rect = codeMirror.getWrapperElement().getBoundingClientRect();
  const topVisibleLine = codeMirror.lineAtHeight(rect.top, "window") - offsetVerticalLines;
  const bottomVisibleLine = codeMirror.lineAtHeight(rect.bottom, "window") + offsetVerticalLines;
  const leftColumn = Math.floor(scrollLeft > 0 ? scrollLeft / charWidth - offsetHorizontalCharacters : 0);
  const rightPosition = scrollLeft + (scrollArea.clientWidth - 30);
  const rightCharacter = Math.floor(rightPosition / charWidth) + offsetHorizontalCharacters;
  return {
    start: {
      line: topVisibleLine || 0,
      column: leftColumn || 0
    },
    end: {
      line: bottomVisibleLine || 0,
      column: rightCharacter
    }
  };
}

function markText({
  codeMirror
}, className, {
  start,
  end
}) {
  return codeMirror.markText({
    ch: start.column,
    line: start.line
  }, {
    ch: end.column,
    line: end.line
  }, {
    className
  });
}

function lineAtHeight({
  codeMirror
}, sourceId, event) {
  const _editorLine = codeMirror.lineAtHeight(event.clientY);

  return toSourceLine(sourceId, _editorLine);
}

function getSourceLocationFromMouseEvent({
  codeMirror
}, source, e) {
  const {
    line,
    ch
  } = codeMirror.coordsChar({
    left: e.clientX,
    top: e.clientY
  });
  return (0, _location.createLocation)({
    source,
    line: fromEditorLine(source.id, line, (0, _wasm.isWasm)(source.id)),
    column: (0, _wasm.isWasm)(source.id) ? 0 : ch + 1
  });
}

function forEachLine(codeMirror, iter) {
  codeMirror.operation(() => {
    codeMirror.doc.iter(0, codeMirror.lineCount(), iter);
  });
}

function removeLineClass(codeMirror, line, className) {
  codeMirror.removeLineClass(line, "wrap", className);
}

function clearLineClass(codeMirror, className) {
  forEachLine(codeMirror, line => {
    removeLineClass(codeMirror, line, className);
  });
}

function getTextForLine(codeMirror, line) {
  return codeMirror.getLine(line - 1).trim();
}

function getCursorLine(codeMirror) {
  return codeMirror.getCursor().line;
}

function getCursorColumn(codeMirror) {
  return codeMirror.getCursor().ch;
}