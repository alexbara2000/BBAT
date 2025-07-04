"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_frames", "devtools/client/debugger/src/utils/pause/frames/index");

var _AccessibleImage = _interopRequireDefault(require("../../shared/AccessibleImage"));

var _Frame = _interopRequireDefault(require("./Frame"));

var _Badge = _interopRequireDefault(require("../../shared/Badge"));

var _FrameIndent = _interopRequireDefault(require("./FrameIndent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

function FrameLocation({
  frame,
  expanded
}) {
  const library = frame.library || (0, _frames.getLibraryFromUrl)(frame);

  if (!library) {
    return null;
  }

  const arrowClassName = classnames("arrow", {
    expanded
  });
  return _react.default.createElement("span", {
    className: "group-description"
  }, _react.default.createElement(_AccessibleImage.default, {
    className: arrowClassName
  }), _react.default.createElement(_AccessibleImage.default, {
    className: `annotation-logo ${library.toLowerCase()}`
  }), _react.default.createElement("span", {
    className: "group-description-name"
  }, library));
}

FrameLocation.propTypes = {
  expanded: _propTypes.default.any.isRequired,
  frame: _propTypes.default.object.isRequired
};
FrameLocation.displayName = "FrameLocation";

class Group extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "toggleFrames", event => {
      event.stopPropagation();
      this.setState(prevState => ({
        expanded: !prevState.expanded
      }));
    });

    this.state = {
      expanded: false
    };
  }

  static get propTypes() {
    return {
      disableContextMenu: _propTypes.default.bool.isRequired,
      displayFullUrl: _propTypes.default.bool.isRequired,
      getFrameTitle: _propTypes.default.func,
      group: _propTypes.default.array.isRequired,
      panel: _propTypes.default.oneOf(["debugger", "webconsole"]).isRequired,
      selectFrame: _propTypes.default.func.isRequired,
      selectLocation: _propTypes.default.func,
      selectedFrame: _propTypes.default.object,
      showFrameContextMenu: _propTypes.default.func.isRequired
    };
  }

  get isSelectable() {
    return this.props.panel == "webconsole";
  }

  onContextMenu(event) {
    const {
      group
    } = this.props;
    const frame = group[0];
    this.props.showFrameContextMenu(event, frame, true);
  }

  renderFrames() {
    const {
      group,
      selectFrame,
      selectLocation,
      selectedFrame,
      displayFullUrl,
      getFrameTitle,
      disableContextMenu,
      panel,
      showFrameContextMenu
    } = this.props;
    const {
      expanded
    } = this.state;

    if (!expanded) {
      return null;
    }

    return _react.default.createElement("div", {
      className: "frames-list"
    }, group.map(frame => _react.default.createElement(_Frame.default, {
      frame: frame,
      showFrameContextMenu: showFrameContextMenu,
      hideLocation: true,
      key: frame.id,
      selectedFrame: selectedFrame,
      selectFrame: selectFrame,
      selectLocation: selectLocation,
      shouldMapDisplayName: false,
      displayFullUrl: displayFullUrl,
      getFrameTitle: getFrameTitle,
      disableContextMenu: disableContextMenu,
      panel: panel,
      isInGroup: true
    })));
  }

  renderDescription() {
    const {
      l10n
    } = this.context;
    const {
      group
    } = this.props;
    const {
      expanded
    } = this.state;
    const frame = group[0];
    const l10NEntry = expanded ? "callStack.group.collapseTooltip" : "callStack.group.expandTooltip";
    const title = l10n.getFormatStr(l10NEntry, frame.library);
    return _react.default.createElement("div", {
      role: "listitem",
      key: frame.id,
      className: "group",
      onClick: this.toggleFrames,
      tabIndex: 0,
      title
    }, this.isSelectable && _react.default.createElement(_FrameIndent.default, null), _react.default.createElement(FrameLocation, {
      frame,
      expanded
    }), this.isSelectable && _react.default.createElement("span", {
      className: "clipboard-only"
    }, " "), _react.default.createElement(_Badge.default, {
      badgeText: this.props.group.length
    }), this.isSelectable && _react.default.createElement("br", {
      className: "clipboard-only"
    }));
  }

  render() {
    const {
      expanded
    } = this.state;
    const {
      disableContextMenu
    } = this.props;
    return _react.default.createElement("div", {
      className: classnames("frames-group", {
        expanded
      }),
      onContextMenu: disableContextMenu ? null : e => this.onContextMenu(e)
    }, this.renderDescription(), this.renderFrames());
  }

}

exports.default = Group;
Group.displayName = "Group";
Group.contextTypes = {
  l10n: _propTypes.default.object
};