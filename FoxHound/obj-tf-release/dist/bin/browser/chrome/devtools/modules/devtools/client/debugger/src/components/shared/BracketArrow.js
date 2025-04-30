"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const classnames = require("devtools/client/shared/classnames.js");

const BracketArrow = ({
  orientation,
  left,
  top,
  bottom
}) => {
  return (0, _reactDomFactories.div)({
    className: classnames("bracket-arrow", orientation || "up"),
    style: {
      left,
      top,
      bottom
    }
  });
};

BracketArrow.propTypes = {
  bottom: _propTypes.default.number,
  left: _propTypes.default.number,
  orientation: _propTypes.default.string.isRequired,
  top: _propTypes.default.number
};
var _default = BracketArrow;
exports.default = _default;