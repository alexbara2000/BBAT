"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _reselect = require("devtools/client/shared/vendor/reselect");

var _actions = _interopRequireDefault(require("../../../actions/index"));

loader.lazyRequireGetter(this, "_Button", "devtools/client/debugger/src/components/shared/Button/index");
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

class Breakpoint extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onContextMenu", event => {
      event.preventDefault();
      this.props.showBreakpointContextMenu(event, this.props.breakpoint, this.props.source);
    });

    _defineProperty(this, "stopClicks", event => event.stopPropagation());

    _defineProperty(this, "onDoubleClick", () => {
      const {
        breakpoint,
        openConditionalPanel
      } = this.props;

      if (breakpoint.options.condition) {
        openConditionalPanel(this.selectedLocation);
      } else if (breakpoint.options.logValue) {
        openConditionalPanel(this.selectedLocation, true);
      }
    });

    _defineProperty(this, "selectBreakpoint", event => {
      event.preventDefault();
      const {
        selectSpecificLocation
      } = this.props;
      selectSpecificLocation(this.selectedLocation);
    });

    _defineProperty(this, "removeBreakpoint", event => {
      const {
        removeBreakpoint,
        breakpoint
      } = this.props;
      event.stopPropagation();
      removeBreakpoint(breakpoint);
    });

    _defineProperty(this, "handleBreakpointCheckbox", () => {
      const {
        breakpoint,
        enableBreakpoint,
        disableBreakpoint
      } = this.props;

      if (breakpoint.disabled) {
        enableBreakpoint(breakpoint);
      } else {
        disableBreakpoint(breakpoint);
      }
    });
  }

  static get propTypes() {
    return {
      breakpoint: _propTypes.default.object.isRequired,
      disableBreakpoint: _propTypes.default.func.isRequired,
      editor: _propTypes.default.object.isRequired,
      enableBreakpoint: _propTypes.default.func.isRequired,
      frame: _propTypes.default.object,
      openConditionalPanel: _propTypes.default.func.isRequired,
      removeBreakpoint: _propTypes.default.func.isRequired,
      selectSpecificLocation: _propTypes.default.func.isRequired,
      selectedSource: _propTypes.default.object,
      source: _propTypes.default.object.isRequired,
      blackboxedRangesForSource: _propTypes.default.array.isRequired,
      checkSourceOnIgnoreList: _propTypes.default.func.isRequired,
      isBreakpointLineBlackboxed: _propTypes.default.bool,
      showBreakpointContextMenu: _propTypes.default.func.isRequired
    };
  }

  get selectedLocation() {
    const {
      breakpoint,
      selectedSource
    } = this.props;
    return (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource);
  }

  isCurrentlyPausedAtBreakpoint() {
    const {
      frame
    } = this.props;

    if (!frame) {
      return false;
    }

    const bpId = (0, _breakpoint.makeBreakpointId)(this.selectedLocation);
    const frameId = (0, _breakpoint.makeBreakpointId)(frame.selectedLocation);
    return bpId == frameId;
  }

  getBreakpointLocation() {
    const {
      source
    } = this.props;
    const {
      column,
      line
    } = this.selectedLocation;
    const isWasm = source === null || source === void 0 ? void 0 : source.isWasm; // column is 0-based everywhere, but we want to display 1-based to the user.

    const columnVal = column ? `:${column + 1}` : "";
    const bpLocation = isWasm ? `0x${line.toString(16).toUpperCase()}` : `${line}${columnVal}`;
    return bpLocation;
  }

  getBreakpointText() {
    const {
      breakpoint,
      selectedSource
    } = this.props;
    const {
      condition,
      logValue
    } = breakpoint.options;
    return logValue || condition || (0, _breakpoint.getSelectedText)(breakpoint, selectedSource);
  }

  highlightText(text = "", editor) {
    const node = document.createElement("div");
    editor.CodeMirror.runMode(text, "application/javascript", node);
    return {
      __html: node.innerHTML
    };
  }

  render() {
    const {
      breakpoint,
      editor,
      isBreakpointLineBlackboxed
    } = this.props;
    const text = this.getBreakpointText();
    const labelId = `${breakpoint.id}-label`;
    return (0, _reactDomFactories.div)({
      className: classnames({
        breakpoint,
        paused: this.isCurrentlyPausedAtBreakpoint(),
        disabled: breakpoint.disabled,
        "is-conditional": !!breakpoint.options.condition,
        "is-log": !!breakpoint.options.logValue
      }),
      onClick: this.selectBreakpoint,
      onDoubleClick: this.onDoubleClick,
      onContextMenu: this.onContextMenu
    }, (0, _reactDomFactories.input)({
      id: breakpoint.id,
      type: "checkbox",
      className: "breakpoint-checkbox",
      checked: !breakpoint.disabled,
      disabled: isBreakpointLineBlackboxed,
      onChange: this.handleBreakpointCheckbox,
      onClick: this.stopClicks,
      "aria-labelledby": labelId
    }), (0, _reactDomFactories.span)({
      id: labelId,
      className: "breakpoint-label cm-s-mozilla devtools-monospace",
      onClick: this.selectBreakpoint,
      title: text
    }, (0, _reactDomFactories.span)({
      dangerouslySetInnerHTML: this.highlightText(text, editor)
    })), (0, _reactDomFactories.div)({
      className: "breakpoint-line-close"
    }, (0, _reactDomFactories.div)({
      className: "breakpoint-line devtools-monospace"
    }, this.getBreakpointLocation()), _react.default.createElement(_Button.CloseButton, {
      handleClick: this.removeBreakpoint,
      tooltip: L10N.getStr("breakpoints.removeBreakpointTooltip")
    })));
  }

}

const getFormattedFrame = (0, _reselect.createSelector)(_selectors.getSelectedSource, _selectors.getSelectedFrame, (selectedSource, frame) => {
  if (!frame) {
    return null;
  }

  return { ...frame,
    selectedLocation: (0, _selectedLocation.getSelectedLocation)(frame, selectedSource)
  };
});

const mapStateToProps = (state, props) => {
  const blackboxedRangesForSource = (0, _selectors.getBlackBoxRanges)(state)[props.source.url];
  const isSourceOnIgnoreList = (0, _selectors.isSourceMapIgnoreListEnabled)(state) && (0, _selectors.isSourceOnSourceMapIgnoreList)(state, props.source);
  return {
    selectedSource: (0, _selectors.getSelectedSource)(state),
    isBreakpointLineBlackboxed: (0, _source.isLineBlackboxed)(blackboxedRangesForSource, props.breakpoint.location.line, isSourceOnIgnoreList),
    frame: getFormattedFrame(state, (0, _selectors.getCurrentThread)(state))
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  enableBreakpoint: _actions.default.enableBreakpoint,
  removeBreakpoint: _actions.default.removeBreakpoint,
  disableBreakpoint: _actions.default.disableBreakpoint,
  selectSpecificLocation: _actions.default.selectSpecificLocation,
  openConditionalPanel: _actions.default.openConditionalPanel,
  showBreakpointContextMenu: _actions.default.showBreakpointContextMenu
})(Breakpoint);

exports.default = _default;