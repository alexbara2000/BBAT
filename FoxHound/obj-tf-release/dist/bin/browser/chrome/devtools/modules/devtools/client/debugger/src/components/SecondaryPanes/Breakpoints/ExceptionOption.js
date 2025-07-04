"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ExceptionOption;

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function ExceptionOption({
  className,
  isChecked = false,
  label: inputLabel,
  onChange
}) {
  return (0, _reactDomFactories.label)({
    className
  }, (0, _reactDomFactories.input)({
    type: "checkbox",
    checked: isChecked,
    onChange: onChange
  }), (0, _reactDomFactories.div)({
    className: "breakpoint-exceptions-label"
  }, inputLabel));
}

ExceptionOption.propTypes = {
  className: _propTypes.default.string.isRequired,
  isChecked: _propTypes.default.bool.isRequired,
  label: _propTypes.default.string.isRequired,
  onChange: _propTypes.default.func.isRequired
};