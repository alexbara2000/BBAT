"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debugBtn = debugBtn;
exports.default = void 0;

var _react = _interopRequireDefault(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _AccessibleImage = _interopRequireDefault(require("../AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const classnames = require("devtools/client/shared/classnames.js");

function debugBtn(onClick, type, className, tooltip, disabled = false, ariaPressed = false) {
  return _react.default.createElement(CommandBarButton, {
    className: classnames(type, className),
    disabled: disabled,
    key: type,
    onClick: onClick,
    pressed: ariaPressed,
    title: tooltip
  }, _react.default.createElement(_AccessibleImage.default, {
    className: type
  }));
}

const CommandBarButton = props => {
  const {
    children,
    className,
    pressed = false,
    ...rest
  } = props;
  return (0, _reactDomFactories.button)({
    "aria-pressed": pressed,
    className: classnames("command-bar-button", className),
    ...rest
  }, children);
};

CommandBarButton.propTypes = {
  children: _propTypes.default.node.isRequired,
  className: _propTypes.default.string.isRequired,
  pressed: _propTypes.default.bool
};
var _default = CommandBarButton;
exports.default = _default;