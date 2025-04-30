"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPreview = getPreview;
exports.getExceptionPreview = getExceptionPreview;
loader.lazyRequireGetter(this, "_preview", "devtools/client/debugger/src/utils/preview");
loader.lazyRequireGetter(this, "_evaluationResult", "devtools/client/debugger/src/utils/evaluation-result");
loader.lazyRequireGetter(this, "_getExpression", "devtools/client/debugger/src/utils/editor/get-expression");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/actions/expressions");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
async function findExpressionMatch(state, parserWorker, codeMirror, tokenPos) {
  const location = (0, _selectors.getSelectedLocation)(state);

  if (!location) {
    return null;
  } // Fallback on expression from codemirror cursor if parser worker misses symbols
  // or is unable to find a match.


  const match = await parserWorker.findBestMatchExpression(location.source.id, tokenPos);

  if (match) {
    return match;
  }

  return (0, _getExpression.getExpressionFromCoords)(codeMirror, tokenPos);
}

function getPreview(target, tokenPos, codeMirror) {
  return async thunkArgs => {
    const {
      getState,
      client,
      parserWorker
    } = thunkArgs;

    if (!(0, _selectors.isSelectedFrameVisible)(getState()) || !(0, _selectors.isLineInScope)(getState(), tokenPos.line)) {
      return null;
    }

    const source = (0, _selectors.getSelectedSource)(getState());

    if (!source) {
      return null;
    }

    const thread = (0, _selectors.getCurrentThread)(getState());
    const selectedFrame = (0, _selectors.getSelectedFrame)(getState(), thread);

    if (!selectedFrame) {
      return null;
    }

    const match = await findExpressionMatch(getState(), parserWorker, codeMirror, tokenPos);

    if (!match) {
      return null;
    }

    let {
      expression,
      location
    } = match;

    if ((0, _preview.isConsole)(expression)) {
      return null;
    }

    if (location && source.isOriginal) {
      const mapResult = await (0, _expressions.getMappedExpression)(expression, thread, thunkArgs);

      if (mapResult) {
        expression = mapResult.expression;
      }
    }

    const {
      result
    } = await client.evaluate(expression, {
      frameId: selectedFrame.id
    });
    const resultGrip = (0, _evaluationResult.getGrip)(result); // Error case occurs for a token that follows an errored evaluation
    // https://github.com/firefox-devtools/debugger/pull/8056
    // Accommodating for null allows us to show preview for falsy values
    // line "", false, null, Nan, and more

    if (resultGrip === null) {
      return null;
    } // Handle cases where the result is invisible to the debugger
    // and not possible to preview. Bug 1548256


    if (resultGrip && resultGrip.class && typeof resultGrip.class === "string" && resultGrip.class.includes("InvisibleToDebugger")) {
      return null;
    }

    const root = {
      path: expression,
      contents: {
        value: resultGrip,
        front: (0, _evaluationResult.getFront)(result)
      }
    };
    return {
      target,
      tokenPos,
      cursorPos: target.getBoundingClientRect(),
      expression,
      root,
      resultGrip
    };
  };
}

function getExceptionPreview(target, tokenPos, codeMirror) {
  return async ({
    dispatch,
    getState,
    parserWorker
  }) => {
    const match = await findExpressionMatch(getState(), parserWorker, codeMirror, tokenPos);

    if (!match) {
      return null;
    }

    const tokenColumnStart = match.location.start.column + 1;
    const exception = (0, _selectors.getSelectedException)(getState(), tokenPos.line, tokenColumnStart);

    if (!exception) {
      return null;
    }

    return {
      target,
      tokenPos,
      cursorPos: target.getBoundingClientRect(),
      exception
    };
  };
}