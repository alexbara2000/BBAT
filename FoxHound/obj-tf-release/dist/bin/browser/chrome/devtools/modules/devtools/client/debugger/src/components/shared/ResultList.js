"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _AccessibleImage = _interopRequireDefault(require("./AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

class ResultList extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "renderListItem", (item, index) => {
      if (item.value === "/" && item.title === "") {
        item.title = "(index)";
      }

      const {
        selectItem,
        selected
      } = this.props;
      const props = {
        onClick: event => selectItem(event, item, index),
        key: `${item.id}${item.value}${index}`,
        ref: _react.default.createRef(),
        title: item.value,
        "aria-labelledby": `${item.id}-title`,
        "aria-describedby": `${item.id}-subtitle`,
        role: "option",
        className: classnames("result-item", {
          selected: index === selected
        })
      };
      return (0, _reactDomFactories.li)(props, item.icon && (0, _reactDomFactories.div)({
        className: "icon"
      }, _react.default.createElement(_AccessibleImage.default, {
        className: item.icon
      })), (0, _reactDomFactories.div)({
        id: `${item.id}-title`,
        className: "title"
      }, item.title), item.subtitle != item.title ? (0, _reactDomFactories.div)({
        id: `${item.id}-subtitle`,
        className: "subtitle"
      }, item.subtitle) : null);
    });
  }

  static get propTypes() {
    return {
      items: _propTypes.default.array.isRequired,
      role: _propTypes.default.oneOf(["listbox"]),
      selectItem: _propTypes.default.func.isRequired,
      selected: _propTypes.default.number.isRequired,
      size: _propTypes.default.oneOf(["big", "small"])
    };
  }

  render() {
    const {
      size,
      items,
      role
    } = this.props;
    return (0, _reactDomFactories.ul)({
      className: classnames("result-list", size),
      id: "result-list",
      role: role,
      "aria-live": "polite"
    }, items.map(this.renderListItem));
  }

}

exports.default = ResultList;

_defineProperty(ResultList, "defaultProps", {
  size: "small",
  role: "listbox"
});