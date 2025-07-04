"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _AccessibleImage = _interopRequireDefault(require("../AccessibleImage"));

loader.lazyRequireGetter(this, "_", "devtools/client/debugger/src/components/shared/Button/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

class PaneToggleButton extends _react.PureComponent {
  static get propTypes() {
    return {
      collapsed: _propTypes.default.bool.isRequired,
      handleClick: _propTypes.default.func.isRequired,
      horizontal: _propTypes.default.bool.isRequired,
      position: _propTypes.default.oneOf(["start", "end"]).isRequired
    };
  }

  label(position, collapsed) {
    switch (position) {
      case "start":
        return L10N.getStr(collapsed ? "expandSources" : "collapseSources");

      case "end":
        return L10N.getStr(collapsed ? "expandBreakpoints" : "collapseBreakpoints");
    }

    return null;
  }

  render() {
    const {
      position,
      collapsed,
      horizontal,
      handleClick
    } = this.props;
    return _react.default.createElement(_.CommandBarButton, {
      className: classnames("toggle-button", position, {
        collapsed,
        vertical: !horizontal
      }),
      onClick: () => handleClick(position, !collapsed),
      title: this.label(position, collapsed)
    }, _react.default.createElement(_AccessibleImage.default, {
      className: collapsed ? "pane-expand" : "pane-collapse"
    }));
  }

}

_defineProperty(PaneToggleButton, "defaultProps", {
  horizontal: false,
  position: "start"
});

var _default = PaneToggleButton;
exports.default = _default;