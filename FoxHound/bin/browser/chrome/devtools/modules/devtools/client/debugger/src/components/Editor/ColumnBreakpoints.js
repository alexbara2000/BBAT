"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _ColumnBreakpoint = _interopRequireDefault(require("./ColumnBreakpoint"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// eslint-disable-next-line max-len
class ColumnBreakpoints extends _react.Component {
  static get propTypes() {
    return {
      columnBreakpoints: _propTypes.default.array.isRequired,
      editor: _propTypes.default.object.isRequired,
      selectedSource: _propTypes.default.object,
      addBreakpoint: _propTypes.default.func,
      removeBreakpoint: _propTypes.default.func,
      toggleDisabledBreakpoint: _propTypes.default.func,
      showEditorCreateBreakpointContextMenu: _propTypes.default.func,
      showEditorEditBreakpointContextMenu: _propTypes.default.func
    };
  }

  render() {
    const {
      editor,
      columnBreakpoints,
      selectedSource,
      showEditorCreateBreakpointContextMenu,
      showEditorEditBreakpointContextMenu,
      toggleDisabledBreakpoint,
      removeBreakpoint,
      addBreakpoint
    } = this.props;

    if (!selectedSource || columnBreakpoints.length === 0) {
      return null;
    }

    let breakpoints;
    editor.codeMirror.operation(() => {
      breakpoints = columnBreakpoints.map(columnBreakpoint => _react.default.createElement(_ColumnBreakpoint.default, {
        key: (0, _breakpoint.makeBreakpointId)(columnBreakpoint.location),
        columnBreakpoint,
        editor,
        source: selectedSource,
        showEditorCreateBreakpointContextMenu,
        showEditorEditBreakpointContextMenu,
        toggleDisabledBreakpoint,
        removeBreakpoint,
        addBreakpoint
      }));
    });
    return (0, _reactDomFactories.div)(null, breakpoints);
  }

}

const mapStateToProps = state => {
  // Avoid rendering this component is there is no selected source,
  // or if the selected source is blackboxed.
  // Also avoid computing visible column breakpoint when this happens.
  const selectedSource = (0, _selectors.getSelectedSource)(state);

  if (!selectedSource || (0, _selectors.isSourceBlackBoxed)(state, selectedSource)) {
    return {};
  }

  return {
    selectedSource,
    columnBreakpoints: (0, _selectors.visibleColumnBreakpoints)(state)
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  showEditorCreateBreakpointContextMenu: _actions.default.showEditorCreateBreakpointContextMenu,
  showEditorEditBreakpointContextMenu: _actions.default.showEditorEditBreakpointContextMenu,
  toggleDisabledBreakpoint: _actions.default.toggleDisabledBreakpoint,
  removeBreakpoint: _actions.default.removeBreakpoint,
  addBreakpoint: _actions.default.addBreakpoint
})(ColumnBreakpoints);

exports.default = _default;