"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _Exception = _interopRequireDefault(require("./Exception"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class Exceptions extends _react.Component {
  static get propTypes() {
    return {
      exceptions: _propTypes.default.array,
      selectedSource: _propTypes.default.object
    };
  }

  render() {
    const {
      exceptions,
      selectedSource
    } = this.props;

    if (!selectedSource || !exceptions.length) {
      return null;
    }

    const doc = (0, _editor.getDocument)(selectedSource.id);
    return _react.default.createElement(_react.default.Fragment, null, exceptions.map(exception => _react.default.createElement(_Exception.default, {
      exception,
      doc,
      key: `${exception.sourceActorId}:${exception.lineNumber}`,
      selectedSource
    })));
  }

}

var _default = (0, _connect.connect)(state => {
  const selectedSource = (0, _selectors.getSelectedSource)(state); // Avoid calling getSelectedSourceExceptions when there is no source selected.

  if (!selectedSource) {
    return {};
  } // Avoid causing any update until we start having exceptions


  const exceptions = (0, _selectors.getSelectedSourceExceptions)(state);

  if (!exceptions.length) {
    return {};
  }

  return {
    exceptions: (0, _selectors.getSelectedSourceExceptions)(state),
    selectedSource
  };
})(Exceptions);

exports.default = _default;