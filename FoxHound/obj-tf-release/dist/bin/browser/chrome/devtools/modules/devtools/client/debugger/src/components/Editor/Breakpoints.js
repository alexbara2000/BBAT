"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _Breakpoint = _interopRequireDefault(require("./Breakpoint"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _actions = _interopRequireDefault(require("../../actions/index"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class Breakpoints extends _react.Component {
  static get propTypes() {
    return {
      breakpoints: _propTypes.default.array,
      editor: _propTypes.default.object,
      selectedSource: _propTypes.default.object,
      removeBreakpointsAtLine: _propTypes.default.func,
      toggleBreakpointsAtLine: _propTypes.default.func,
      continueToHere: _propTypes.default.func,
      showEditorEditBreakpointContextMenu: _propTypes.default.func
    };
  }

  render() {
    const {
      breakpoints,
      selectedSource,
      editor,
      showEditorEditBreakpointContextMenu,
      continueToHere,
      toggleBreakpointsAtLine,
      removeBreakpointsAtLine
    } = this.props;

    if (!selectedSource || !breakpoints) {
      return null;
    }

    return (0, _reactDomFactories.div)(null, breakpoints.map(breakpoint => {
      return _react.default.createElement(_Breakpoint.default, {
        key: (0, _breakpoint.makeBreakpointId)(breakpoint.location),
        breakpoint,
        selectedSource,
        showEditorEditBreakpointContextMenu,
        continueToHere,
        toggleBreakpointsAtLine,
        removeBreakpointsAtLine,
        editor
      });
    }));
  }

}

const mapStateToProps = state => {
  const selectedSource = (0, _selectors.getSelectedSource)(state);
  return {
    // Retrieves only the first breakpoint per line so that the
    // breakpoint marker represents only the first breakpoint
    breakpoints: (0, _selectors.getFirstVisibleBreakpoints)(state),
    selectedSource
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  showEditorEditBreakpointContextMenu: _actions.default.showEditorEditBreakpointContextMenu,
  continueToHere: _actions.default.continueToHere,
  toggleBreakpointsAtLine: _actions.default.toggleBreakpointsAtLine,
  removeBreakpointsAtLine: _actions.default.removeBreakpointsAtLine
})(Breakpoints);

exports.default = _default;