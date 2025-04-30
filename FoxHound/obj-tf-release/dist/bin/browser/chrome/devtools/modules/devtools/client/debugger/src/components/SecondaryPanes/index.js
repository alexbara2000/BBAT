"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _Breakpoints = _interopRequireDefault(require("./Breakpoints/index"));

var _Expressions = _interopRequireDefault(require("./Expressions"));

var _Frames = _interopRequireDefault(require("./Frames/index"));

var _Threads = _interopRequireDefault(require("./Threads"));

var _Accordion = _interopRequireDefault(require("../shared/Accordion"));

var _CommandBar = _interopRequireDefault(require("./CommandBar"));

var _XHRBreakpoints = _interopRequireDefault(require("./XHRBreakpoints"));

var _EventListeners = _interopRequireDefault(require("./EventListeners"));

var _DOMMutationBreakpoints = _interopRequireDefault(require("./DOMMutationBreakpoints"));

var _WhyPaused = _interopRequireDefault(require("./WhyPaused"));

var _Scopes = _interopRequireDefault(require("./Scopes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const SplitBox = require("devtools/client/shared/components/splitter/SplitBox");

const classnames = require("devtools/client/shared/classnames.js");

function debugBtn(onClick, type, className, tooltip) {
  return (0, _reactDomFactories.button)({
    onClick: onClick,
    className: `${type} ${className}`,
    key: type,
    title: tooltip
  }, _react.default.createElement(_AccessibleImage.default, {
    className: type,
    title: tooltip,
    "aria-label": tooltip
  }));
}

const mdnLink = "https://firefox-source-docs.mozilla.org/devtools-user/debugger/using_the_debugger_map_scopes_feature/";

class SecondaryPanes extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "onExpressionAdded", () => {
      this.setState({
        showExpressionsInput: false
      });
    });

    _defineProperty(this, "onXHRAdded", () => {
      this.setState({
        showXHRInput: false
      });
    });

    this.state = {
      showExpressionsInput: false,
      showXHRInput: false
    };
  }

  static get propTypes() {
    return {
      evaluateExpressionsForCurrentContext: _propTypes.default.func.isRequired,
      expressions: _propTypes.default.array.isRequired,
      hasFrames: _propTypes.default.bool.isRequired,
      horizontal: _propTypes.default.bool.isRequired,
      logEventBreakpoints: _propTypes.default.bool.isRequired,
      mapScopesEnabled: _propTypes.default.bool.isRequired,
      pauseReason: _propTypes.default.string.isRequired,
      shouldBreakpointsPaneOpenOnPause: _propTypes.default.bool.isRequired,
      thread: _propTypes.default.string.isRequired,
      renderWhyPauseDelay: _propTypes.default.number.isRequired,
      selectedFrame: _propTypes.default.object,
      skipPausing: _propTypes.default.bool.isRequired,
      source: _propTypes.default.object,
      toggleEventLogging: _propTypes.default.func.isRequired,
      resetBreakpointsPaneState: _propTypes.default.func.isRequired,
      toggleMapScopes: _propTypes.default.func.isRequired,
      threads: _propTypes.default.array.isRequired,
      removeAllBreakpoints: _propTypes.default.func.isRequired,
      removeAllXHRBreakpoints: _propTypes.default.func.isRequired
    };
  }

  watchExpressionHeaderButtons() {
    const {
      expressions
    } = this.props;
    const buttons = [];

    if (expressions.length) {
      buttons.push(debugBtn(() => {
        this.props.evaluateExpressionsForCurrentContext();
      }, "refresh", "active", L10N.getStr("watchExpressions.refreshButton")));
    }

    buttons.push(debugBtn(() => {
      if (!_prefs.prefs.expressionsVisible) {
        this.onWatchExpressionPaneToggle(true);
      }

      this.setState({
        showExpressionsInput: true
      });
    }, "plus", "active", L10N.getStr("expressions.placeholder")));
    return buttons;
  }

  xhrBreakpointsHeaderButtons() {
    return [debugBtn(() => {
      if (!_prefs.prefs.xhrBreakpointsVisible) {
        this.onXHRPaneToggle(true);
      }

      this.setState({
        showXHRInput: true
      });
    }, "plus", "active", L10N.getStr("xhrBreakpoints.label")), debugBtn(() => {
      this.props.removeAllXHRBreakpoints();
    }, "removeAll", "active", L10N.getStr("xhrBreakpoints.removeAll.tooltip"))];
  }

  breakpointsHeaderButtons() {
    return [debugBtn(() => {
      this.props.removeAllBreakpoints();
    }, "removeAll", "active", L10N.getStr("breakpointMenuItem.deleteAll"))];
  }

  getScopeItem() {
    return {
      header: L10N.getStr("scopes.header"),
      className: "scopes-pane",
      component: _react.default.createElement(_Scopes.default, null),
      opened: _prefs.prefs.scopesVisible,
      buttons: this.getScopesButtons(),
      onToggle: opened => {
        _prefs.prefs.scopesVisible = opened;
      }
    };
  }

  getScopesButtons() {
    const {
      selectedFrame,
      mapScopesEnabled,
      source
    } = this.props;

    if (!selectedFrame || !(source === null || source === void 0 ? void 0 : source.isOriginal) || (source === null || source === void 0 ? void 0 : source.isPrettyPrinted)) {
      return null;
    }

    return [(0, _reactDomFactories.div)({
      key: "scopes-buttons"
    }, (0, _reactDomFactories.label)({
      className: "map-scopes-header",
      title: L10N.getStr("scopes.showOriginalScopesTooltip"),
      onClick: e => e.stopPropagation()
    }, (0, _reactDomFactories.input)({
      type: "checkbox",
      checked: mapScopesEnabled ? "checked" : "",
      onChange: e => this.props.toggleMapScopes()
    }), L10N.getStr("scopes.showOriginalScopes")), (0, _reactDomFactories.a)({
      className: "mdn",
      target: "_blank",
      href: mdnLink,
      onClick: e => e.stopPropagation(),
      title: L10N.getStr("scopes.showOriginalScopesHelpTooltip")
    }, _react.default.createElement(_AccessibleImage.default, {
      className: "shortcuts"
    })))];
  }

  getEventButtons() {
    const {
      logEventBreakpoints
    } = this.props;
    return [(0, _reactDomFactories.div)({
      key: "events-buttons"
    }, (0, _reactDomFactories.label)({
      className: "events-header",
      title: L10N.getStr("eventlisteners.log.label")
    }, (0, _reactDomFactories.input)({
      type: "checkbox",
      checked: logEventBreakpoints ? "checked" : "",
      onChange: e => this.props.toggleEventLogging()
    }), L10N.getStr("eventlisteners.log")))];
  }

  onWatchExpressionPaneToggle(opened) {
    _prefs.prefs.expressionsVisible = opened;
  }

  getWatchItem() {
    return {
      header: L10N.getStr("watchExpressions.header"),
      id: "watch-expressions-pane",
      className: "watch-expressions-pane",
      buttons: this.watchExpressionHeaderButtons(),
      component: _react.default.createElement(_Expressions.default, {
        showInput: this.state.showExpressionsInput,
        onExpressionAdded: this.onExpressionAdded
      }),
      opened: _prefs.prefs.expressionsVisible,
      onToggle: this.onWatchExpressionPaneToggle
    };
  }

  onXHRPaneToggle(opened) {
    _prefs.prefs.xhrBreakpointsVisible = opened;
  }

  getXHRItem() {
    const {
      pauseReason
    } = this.props;
    return {
      header: L10N.getStr("xhrBreakpoints.header"),
      id: "xhr-breakpoints-pane",
      className: "xhr-breakpoints-pane",
      buttons: this.xhrBreakpointsHeaderButtons(),
      component: _react.default.createElement(_XHRBreakpoints.default, {
        showInput: this.state.showXHRInput,
        onXHRAdded: this.onXHRAdded
      }),
      opened: _prefs.prefs.xhrBreakpointsVisible || pauseReason === "XHR",
      onToggle: this.onXHRPaneToggle
    };
  }

  getCallStackItem() {
    return {
      header: L10N.getStr("callStack.header"),
      id: "call-stack-pane",
      className: "call-stack-pane",
      component: _react.default.createElement(_Frames.default, {
        panel: "debugger"
      }),
      opened: _prefs.prefs.callStackVisible,
      onToggle: opened => {
        _prefs.prefs.callStackVisible = opened;
      }
    };
  }

  getThreadsItem() {
    return {
      header: L10N.getStr("threadsHeader"),
      id: "threads-pane",
      className: "threads-pane",
      component: _react.default.createElement(_Threads.default, null),
      opened: _prefs.prefs.threadsVisible,
      onToggle: opened => {
        _prefs.prefs.threadsVisible = opened;
      }
    };
  }

  getBreakpointsItem() {
    const {
      pauseReason,
      shouldBreakpointsPaneOpenOnPause,
      thread
    } = this.props;
    return {
      header: L10N.getStr("breakpoints.header"),
      id: "breakpoints-pane",
      className: "breakpoints-pane",
      buttons: this.breakpointsHeaderButtons(),
      component: _react.default.createElement(_Breakpoints.default),
      opened: _prefs.prefs.breakpointsVisible || pauseReason === "breakpoint" && shouldBreakpointsPaneOpenOnPause,
      onToggle: opened => {
        _prefs.prefs.breakpointsVisible = opened; //  one-shot flag used to force open the Breakpoints Pane only
        //  when hitting a breakpoint, but not when selecting frames etc...

        if (shouldBreakpointsPaneOpenOnPause) {
          this.props.resetBreakpointsPaneState(thread);
        }
      }
    };
  }

  getEventListenersItem() {
    const {
      pauseReason
    } = this.props;
    return {
      header: L10N.getStr("eventListenersHeader1"),
      id: "event-listeners-pane",
      className: "event-listeners-pane",
      buttons: this.getEventButtons(),
      component: _react.default.createElement(_EventListeners.default, null),
      opened: _prefs.prefs.eventListenersVisible || pauseReason === "eventBreakpoint",
      onToggle: opened => {
        _prefs.prefs.eventListenersVisible = opened;
      }
    };
  }

  getDOMMutationsItem() {
    const {
      pauseReason
    } = this.props;
    return {
      header: L10N.getStr("domMutationHeader"),
      id: "dom-mutations-pane",
      className: "dom-mutations-pane",
      buttons: [],
      component: _react.default.createElement(_DOMMutationBreakpoints.default, null),
      opened: _prefs.prefs.domMutationBreakpointsVisible || pauseReason === "mutationBreakpoint",
      onToggle: opened => {
        _prefs.prefs.domMutationBreakpointsVisible = opened;
      }
    };
  }

  getStartItems() {
    const items = [];
    const {
      horizontal,
      hasFrames
    } = this.props;

    if (horizontal) {
      if (this.props.threads.length) {
        items.push(this.getThreadsItem());
      }

      items.push(this.getWatchItem());
    }

    items.push(this.getBreakpointsItem());

    if (hasFrames) {
      items.push(this.getCallStackItem());

      if (horizontal) {
        items.push(this.getScopeItem());
      }
    }

    items.push(this.getXHRItem());
    items.push(this.getEventListenersItem());
    items.push(this.getDOMMutationsItem());
    return items;
  }

  getEndItems() {
    if (this.props.horizontal) {
      return [];
    }

    const items = [];

    if (this.props.threads.length) {
      items.push(this.getThreadsItem());
    }

    items.push(this.getWatchItem());

    if (this.props.hasFrames) {
      items.push(this.getScopeItem());
    }

    return items;
  }

  getItems() {
    return [...this.getStartItems(), ...this.getEndItems()];
  }

  renderHorizontalLayout() {
    const {
      renderWhyPauseDelay
    } = this.props;
    return (0, _reactDomFactories.div)(null, _react.default.createElement(_WhyPaused.default, {
      delay: renderWhyPauseDelay
    }), _react.default.createElement(_Accordion.default, {
      items: this.getItems()
    }));
  }

  renderVerticalLayout() {
    return _react.default.createElement(SplitBox, {
      initialSize: "300px",
      minSize: 10,
      maxSize: "50%",
      splitterSize: 1,
      startPanel: (0, _reactDomFactories.div)({
        style: {
          width: "inherit"
        }
      }, _react.default.createElement(_WhyPaused.default, {
        delay: this.props.renderWhyPauseDelay
      }), _react.default.createElement(_Accordion.default, {
        items: this.getStartItems()
      })),
      endPanel: _react.default.createElement(_Accordion.default, {
        items: this.getEndItems()
      })
    });
  }

  render() {
    const {
      skipPausing
    } = this.props;
    return (0, _reactDomFactories.div)({
      className: "secondary-panes-wrapper"
    }, _react.default.createElement(_CommandBar.default, {
      horizontal: this.props.horizontal
    }), _react.default.createElement("div", {
      className: classnames("secondary-panes", skipPausing && "skip-pausing")
    }, this.props.horizontal ? this.renderHorizontalLayout() : this.renderVerticalLayout()));
  }

} // Checks if user is in debugging mode and adds a delay preventing
// excessive vertical 'jumpiness'


function getRenderWhyPauseDelay(state, thread) {
  const inPauseCommand = !!(0, _selectors.getPauseCommand)(state, thread);

  if (!inPauseCommand) {
    return 100;
  }

  return 0;
}

const mapStateToProps = state => {
  const thread = (0, _selectors.getCurrentThread)(state);
  const selectedFrame = (0, _selectors.getSelectedFrame)(state, thread);
  const pauseReason = (0, _selectors.getPauseReason)(state, thread);
  const shouldBreakpointsPaneOpenOnPause = (0, _selectors.getShouldBreakpointsPaneOpenOnPause)(state, thread);
  return {
    expressions: (0, _selectors.getExpressions)(state),
    hasFrames: !!(0, _selectors.getTopFrame)(state, thread),
    renderWhyPauseDelay: getRenderWhyPauseDelay(state, thread),
    selectedFrame,
    mapScopesEnabled: (0, _selectors.isMapScopesEnabled)(state),
    threads: (0, _selectors.getThreads)(state),
    skipPausing: (0, _selectors.getSkipPausing)(state),
    logEventBreakpoints: (0, _selectors.shouldLogEventBreakpoints)(state),
    source: (0, _selectors.getSelectedSource)(state),
    pauseReason: (pauseReason === null || pauseReason === void 0 ? void 0 : pauseReason.type) ?? "",
    shouldBreakpointsPaneOpenOnPause,
    thread
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  evaluateExpressionsForCurrentContext: _actions.default.evaluateExpressionsForCurrentContext,
  toggleMapScopes: _actions.default.toggleMapScopes,
  breakOnNext: _actions.default.breakOnNext,
  toggleEventLogging: _actions.default.toggleEventLogging,
  removeAllBreakpoints: _actions.default.removeAllBreakpoints,
  removeAllXHRBreakpoints: _actions.default.removeAllXHRBreakpoints,
  resetBreakpointsPaneState: _actions.default.resetBreakpointsPaneState
})(SecondaryPanes);

exports.default = _default;