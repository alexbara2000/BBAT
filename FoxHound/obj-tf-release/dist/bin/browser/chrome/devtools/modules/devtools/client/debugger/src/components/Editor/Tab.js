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

loader.lazyRequireGetter(this, "_Button", "devtools/client/debugger/src/components/shared/Button/index");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

class Tab extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onContextMenu", event => {
      event.preventDefault();
      this.props.showTabContextMenu(event, this.props.source);
    });
  }

  static get propTypes() {
    return {
      closeTab: _propTypes.default.func.isRequired,
      onDragEnd: _propTypes.default.func.isRequired,
      onDragOver: _propTypes.default.func.isRequired,
      onDragStart: _propTypes.default.func.isRequired,
      selectSource: _propTypes.default.func.isRequired,
      source: _propTypes.default.object.isRequired,
      sourceActor: _propTypes.default.object.isRequired,
      tabSources: _propTypes.default.array.isRequired,
      isBlackBoxed: _propTypes.default.bool.isRequired
    };
  }

  isSourceSearchEnabled() {
    return this.props.activeSearch === "source";
  }

  render() {
    const {
      selectSource,
      closeTab,
      source,
      sourceActor,
      tabSources,
      onDragOver,
      onDragStart,
      onDragEnd,
      index,
      isActive
    } = this.props;
    const sourceId = source.id;
    const isPrettyCode = (0, _source.isPretty)(source);

    function onClickClose(e) {
      e.stopPropagation();
      closeTab(source);
    }

    function handleTabClick(e) {
      e.preventDefault();
      e.stopPropagation();
      return selectSource(source, sourceActor);
    }

    const className = classnames("source-tab", {
      active: isActive,
      pretty: isPrettyCode,
      blackboxed: this.props.isBlackBoxed
    });
    const path = (0, _source.getDisplayPath)(source, tabSources);
    const query = (0, _source.getSourceQueryString)(source);
    return (0, _reactDomFactories.div)({
      draggable: true,
      onDragOver: onDragOver,
      onDragStart: onDragStart,
      onDragEnd: onDragEnd,
      className: className,
      "data-index": index,
      "data-source-id": sourceId,
      onClick: handleTabClick,
      // Accommodate middle click to close tab
      onMouseUp: e => e.button === 1 && closeTab(source),
      onContextMenu: this.onContextMenu,
      title: (0, _source.getFileURL)(source, false)
    }, _react.default.createElement(_SourceIcon.default, {
      location: (0, _location.createLocation)({
        source,
        sourceActor
      }),
      forTab: true,
      modifier: icon => ["file", "javascript"].includes(icon) ? null : icon
    }), (0, _reactDomFactories.div)({
      className: "filename"
    }, (0, _source.getTruncatedFileName)(source, query), path && (0, _reactDomFactories.span)(null, `../${path}/..`)), _react.default.createElement(_Button.CloseButton, {
      handleClick: onClickClose,
      tooltip: L10N.getStr("sourceTabs.closeTabButtonTooltip")
    }));
  }

}

const mapStateToProps = (state, {
  source
}) => {
  var _getSelectedLocation;

  return {
    tabSources: (0, _selectors.getSourcesForTabs)(state),
    isBlackBoxed: (0, _selectors.isSourceBlackBoxed)(state, source),
    isActive: source.id === ((_getSelectedLocation = (0, _selectors.getSelectedLocation)(state)) === null || _getSelectedLocation === void 0 ? void 0 : _getSelectedLocation.source.id)
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  selectSource: _actions.default.selectSource,
  closeTab: _actions.default.closeTab,
  showTabContextMenu: _actions.default.showTabContextMenu
}, null, {
  withRef: true
})(Tab);

exports.default = _default;