"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _SourceIcon = _interopRequireDefault(require("../shared/SourceIcon"));

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/sources-tree/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

class SourceTreeItem extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onClick", e => {
      const {
        item,
        focusItem,
        selectSourceItem
      } = this.props;
      focusItem(item);

      if (item.type == "source") {
        selectSourceItem(item);
      }
    });

    _defineProperty(this, "onContextMenu", event => {
      event.stopPropagation();
      event.preventDefault();
      this.props.showSourceTreeItemContextMenu(event, this.props.item, this.props.depth, this.props.setExpanded, this.renderItemName());
    });
  }

  static get propTypes() {
    return {
      autoExpand: _propTypes.default.bool.isRequired,
      depth: _propTypes.default.bool.isRequired,
      expanded: _propTypes.default.bool.isRequired,
      focusItem: _propTypes.default.func.isRequired,
      focused: _propTypes.default.bool.isRequired,
      hasMatchingGeneratedSource: _propTypes.default.bool.isRequired,
      item: _propTypes.default.object.isRequired,
      selectSourceItem: _propTypes.default.func.isRequired,
      setExpanded: _propTypes.default.func.isRequired,
      getParent: _propTypes.default.func.isRequired,
      isOverridden: _propTypes.default.bool,
      hideIgnoredSources: _propTypes.default.bool
    };
  }

  componentDidMount() {
    const {
      autoExpand,
      item
    } = this.props;

    if (autoExpand) {
      this.props.setExpanded(item, true, false);
    }
  }

  renderItemArrow() {
    const {
      item,
      expanded
    } = this.props;
    return item.type != "source" ? _react.default.createElement(_AccessibleImage.default, {
      className: classnames("arrow", {
        expanded
      })
    }) : (0, _reactDomFactories.span)({
      className: "img no-arrow"
    });
  }

  renderIcon(item) {
    if (item.type == "thread") {
      const icon = item.thread.targetType.includes("worker") ? "worker" : "window";
      return _react.default.createElement(_AccessibleImage.default, {
        className: classnames(icon)
      });
    }

    if (item.type == "group") {
      if (item.groupName === "Webpack") {
        return _react.default.createElement(_AccessibleImage.default, {
          className: "webpack"
        });
      } else if (item.groupName === "Angular") {
        return _react.default.createElement(_AccessibleImage.default, {
          className: "angular"
        });
      } // Check if the group relates to an extension.
      // This happens when a webextension injects a content script.


      if (item.isForExtensionSource) {
        return _react.default.createElement(_AccessibleImage.default, {
          className: "extension"
        });
      }

      return _react.default.createElement(_AccessibleImage.default, {
        className: "globe-small"
      });
    }

    if (item.type == "directory") {
      return _react.default.createElement(_AccessibleImage.default, {
        className: "folder"
      });
    }

    if (item.type == "source") {
      const {
        source,
        sourceActor
      } = item;
      return _react.default.createElement(_SourceIcon.default, {
        location: (0, _location.createLocation)({
          source,
          sourceActor
        }),
        modifier: icon => {
          // In the SourceTree, extension files should use the file-extension based icon,
          // whereas we use the extension icon in other Components (eg. source tabs and breakpoints pane).
          if (icon === "extension") {
            return _source.sourceTypes[source.displayURL.fileExtension] || "javascript";
          }

          return icon + (this.props.isOverridden ? " override" : "");
        }
      });
    }

    return null;
  }

  renderItemName() {
    const {
      item
    } = this.props;

    if (item.type == "thread") {
      const {
        thread
      } = item;
      return thread.name + (thread.serviceWorkerStatus ? ` (${thread.serviceWorkerStatus})` : "");
    }

    if (item.type == "group") {
      return (0, _utils.safeDecodeItemName)(item.groupName);
    }

    if (item.type == "directory") {
      const parentItem = this.props.getParent(item);
      return (0, _utils.safeDecodeItemName)(item.path.replace(parentItem.path, "").replace(/^\//, ""));
    }

    if (item.type == "source") {
      const {
        displayURL
      } = item.source;
      const name = displayURL.filename + (displayURL.search ? displayURL.search : "");
      return (0, _utils.safeDecodeItemName)(name);
    }

    return null;
  }

  renderItemTooltip() {
    const {
      item
    } = this.props;

    if (item.type == "thread") {
      return item.thread.name;
    }

    if (item.type == "group") {
      return item.groupName;
    }

    if (item.type == "directory") {
      return item.path;
    }

    if (item.type == "source") {
      return item.source.url;
    }

    return null;
  }

  render() {
    const {
      item,
      focused,
      hasMatchingGeneratedSource,
      hideIgnoredSources
    } = this.props;

    if (hideIgnoredSources && item.isBlackBoxed) {
      return null;
    }

    const suffix = hasMatchingGeneratedSource ? (0, _reactDomFactories.span)({
      className: "suffix"
    }, L10N.getStr("sourceFooter.mappedSuffix")) : null;
    return (0, _reactDomFactories.div)({
      className: classnames("node", {
        focused,
        blackboxed: item.type == "source" && item.isBlackBoxed
      }),
      key: item.path,
      onClick: this.onClick,
      onContextMenu: this.onContextMenu,
      title: this.renderItemTooltip()
    }, this.renderItemArrow(), this.renderIcon(item), (0, _reactDomFactories.span)({
      className: "label"
    }, this.renderItemName(), suffix));
  }

}

function getHasMatchingGeneratedSource(state, source) {
  if (!source || !source.isOriginal) {
    return false;
  }

  return !!(0, _selectors.getGeneratedSourceByURL)(state, source.url);
}

const mapStateToProps = (state, props) => {
  const {
    item
  } = props;

  if (item.type == "source") {
    const {
      source
    } = item;
    return {
      hasMatchingGeneratedSource: getHasMatchingGeneratedSource(state, source),
      isOverridden: (0, _selectors.isSourceOverridden)(state, source),
      hideIgnoredSources: (0, _selectors.getHideIgnoredSources)(state)
    };
  }

  return {};
};

var _default = (0, _connect.connect)(mapStateToProps, {
  showSourceTreeItemContextMenu: _actions.default.showSourceTreeItemContextMenu
})(SourceTreeItem);

exports.default = _default;