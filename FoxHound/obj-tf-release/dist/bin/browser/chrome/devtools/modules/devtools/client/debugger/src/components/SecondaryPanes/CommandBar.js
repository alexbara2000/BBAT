"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_text", "devtools/client/debugger/src/utils/text");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_CommandBarButton", "devtools/client/debugger/src/components/shared/Button/CommandBarButton");

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

loader.lazyRequireGetter(this, "_menu", "devtools/client/debugger/src/context-menu/menu");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const classnames = require("devtools/client/shared/classnames.js");

const MenuButton = require("devtools/client/shared/components/menu/MenuButton");

const MenuItem = require("devtools/client/shared/components/menu/MenuItem");

const MenuList = require("devtools/client/shared/components/menu/MenuList");

const isMacOS = Services.appinfo.OS === "Darwin"; // NOTE: the "resume" command will call either the resume or breakOnNext action
// depending on whether or not the debugger is paused or running

const COMMANDS = ["resume", "stepOver", "stepIn", "stepOut"];
const KEYS = {
  WINNT: {
    resume: "F8",
    stepOver: "F10",
    stepIn: "F11",
    stepOut: "Shift+F11",
    trace: "Ctrl+Shift+5"
  },
  Darwin: {
    resume: "Cmd+\\",
    stepOver: "Cmd+'",
    stepIn: "Cmd+;",
    stepOut: "Cmd+Shift+:",
    stepOutDisplay: "Cmd+Shift+;",
    trace: "Ctrl+Shift+5"
  },
  Linux: {
    resume: "F8",
    stepOver: "F10",
    stepIn: "F11",
    stepOut: "Shift+F11",
    trace: "Ctrl+Shift+5"
  }
};
const LOG_METHODS = {
  CONSOLE: "console",
  STDOUT: "stdout"
};

function getKey(action) {
  return getKeyForOS(Services.appinfo.OS, action);
}

function getKeyForOS(os, action) {
  const osActions = KEYS[os] || KEYS.Linux;
  return osActions[action];
}

function formatKey(action) {
  const key = getKey(`${action}Display`) || getKey(action); // On MacOS, we bind both Windows and MacOS/Darwin key shortcuts
  // Display them both, but only when they are different

  if (isMacOS) {
    const winKey = getKeyForOS("WINNT", `${action}Display`) || getKeyForOS("WINNT", action);

    if (key != winKey) {
      return (0, _text.formatKeyShortcut)([key, winKey].join(" "));
    }
  }

  return (0, _text.formatKeyShortcut)(key);
}

class CommandBar extends _react.Component {
  constructor() {
    super();
    this.state = {};
  }

  static get propTypes() {
    return {
      breakOnNext: _propTypes.default.func.isRequired,
      horizontal: _propTypes.default.bool.isRequired,
      isPaused: _propTypes.default.bool.isRequired,
      isTracingEnabled: _propTypes.default.bool.isRequired,
      isWaitingOnBreak: _propTypes.default.bool.isRequired,
      javascriptEnabled: _propTypes.default.bool.isRequired,
      trace: _propTypes.default.func.isRequired,
      resume: _propTypes.default.func.isRequired,
      skipPausing: _propTypes.default.bool.isRequired,
      stepIn: _propTypes.default.func.isRequired,
      stepOut: _propTypes.default.func.isRequired,
      stepOver: _propTypes.default.func.isRequired,
      toggleEditorWrapping: _propTypes.default.func.isRequired,
      toggleInlinePreview: _propTypes.default.func.isRequired,
      toggleJavaScriptEnabled: _propTypes.default.func.isRequired,
      toggleSkipPausing: _propTypes.default.any.isRequired,
      toggleSourceMapsEnabled: _propTypes.default.func.isRequired,
      topFrameSelected: _propTypes.default.bool.isRequired,
      toggleTracing: _propTypes.default.func.isRequired,
      logMethod: _propTypes.default.string.isRequired,
      setJavascriptTracingLogMethod: _propTypes.default.func.isRequired,
      setHideOrShowIgnoredSources: _propTypes.default.func.isRequired,
      toggleSourceMapIgnoreList: _propTypes.default.func.isRequired
    };
  }

  componentWillUnmount() {
    const {
      shortcuts
    } = this.context;
    COMMANDS.forEach(action => shortcuts.off(getKey(action)));

    if (isMacOS) {
      COMMANDS.forEach(action => shortcuts.off(getKeyForOS("WINNT", action)));
    }
  }

  componentDidMount() {
    const {
      shortcuts
    } = this.context;
    COMMANDS.forEach(action => shortcuts.on(getKey(action), e => this.handleEvent(e, action)));

    if (isMacOS) {
      // The Mac supports both the Windows Function keys
      // as well as the Mac non-Function keys
      COMMANDS.forEach(action => shortcuts.on(getKeyForOS("WINNT", action), e => this.handleEvent(e, action)));
    }
  }

  handleEvent(e, action) {
    e.preventDefault();
    e.stopPropagation();

    if (action === "resume") {
      this.props.isPaused ? this.props.resume() : this.props.breakOnNext();
    } else {
      this.props[action]();
    }
  }

  renderStepButtons() {
    const {
      isPaused,
      topFrameSelected
    } = this.props;
    const className = isPaused ? "active" : "disabled";
    const isDisabled = !isPaused;
    return [this.renderPauseButton(), (0, _CommandBarButton.debugBtn)(() => this.props.stepOver(), "stepOver", className, L10N.getFormatStr("stepOverTooltip", formatKey("stepOver")), isDisabled), (0, _CommandBarButton.debugBtn)(() => this.props.stepIn(), "stepIn", className, L10N.getFormatStr("stepInTooltip", formatKey("stepIn")), isDisabled || !topFrameSelected), (0, _CommandBarButton.debugBtn)(() => this.props.stepOut(), "stepOut", className, L10N.getFormatStr("stepOutTooltip", formatKey("stepOut")), isDisabled)];
  }

  resume() {
    this.props.resume();
  }

  renderTraceButton() {
    if (!_prefs.features.javascriptTracing) {
      return null;
    } // Display a button which:
    // - on left click, would toggle on/off javascript tracing
    // - on right click, would display a context menu allowing to choose the logging output (console or stdout)


    return (0, _reactDomFactories.button)({
      className: `devtools-button command-bar-button debugger-trace-menu-button ${this.props.isTracingEnabled ? "active" : ""}`,
      title: this.props.isTracingEnabled ? L10N.getFormatStr("stopTraceButtonTooltip2", formatKey("trace")) : L10N.getFormatStr("startTraceButtonTooltip2", formatKey("trace"), this.props.logMethod),
      onClick: event => {
        this.props.toggleTracing(this.props.logMethod);
      },
      onContextMenu: event => {
        event.preventDefault();
        event.stopPropagation(); // Avoid showing the menu to avoid having to support changing tracing config "live"

        if (this.props.isTracingEnabled) {
          return;
        }

        const items = [{
          id: "debugger-trace-menu-item-console",
          label: L10N.getStr("traceInWebConsole"),
          checked: this.props.logMethod == LOG_METHODS.CONSOLE,
          click: () => {
            this.props.setJavascriptTracingLogMethod(LOG_METHODS.CONSOLE);
          }
        }, {
          id: "debugger-trace-menu-item-stdout",
          label: L10N.getStr("traceInStdout"),
          checked: this.props.logMethod == LOG_METHODS.STDOUT,
          click: () => {
            this.props.setJavascriptTracingLogMethod(LOG_METHODS.STDOUT);
          }
        }];
        (0, _menu.showMenu)(event, items);
      }
    });
  }

  renderPauseButton() {
    const {
      breakOnNext,
      isWaitingOnBreak
    } = this.props;

    if (this.props.isPaused) {
      return (0, _CommandBarButton.debugBtn)(() => this.resume(), "resume", "active", L10N.getFormatStr("resumeButtonTooltip", formatKey("resume")));
    }

    if (isWaitingOnBreak) {
      return (0, _CommandBarButton.debugBtn)(null, "pause", "disabled", L10N.getStr("pausePendingButtonTooltip"), true);
    }

    return (0, _CommandBarButton.debugBtn)(() => breakOnNext(), "pause", "active", L10N.getFormatStr("pauseButtonTooltip", formatKey("resume")));
  }

  renderSkipPausingButton() {
    const {
      skipPausing,
      toggleSkipPausing
    } = this.props;
    return (0, _reactDomFactories.button)({
      className: classnames("command-bar-button", "command-bar-skip-pausing", {
        active: skipPausing
      }),
      title: skipPausing ? L10N.getStr("undoSkipPausingTooltip.label") : L10N.getStr("skipPausingTooltip.label"),
      onClick: toggleSkipPausing
    }, _react.default.createElement(_AccessibleImage.default, {
      className: skipPausing ? "enable-pausing" : "disable-pausing"
    }));
  }

  renderSettingsButton() {
    const {
      toolboxDoc
    } = this.context;
    return _react.default.createElement(MenuButton, {
      menuId: "debugger-settings-menu-button",
      toolboxDoc: toolboxDoc,
      className: "devtools-button command-bar-button debugger-settings-menu-button",
      title: L10N.getStr("settings.button.label")
    }, () => this.renderSettingsMenuItems());
  }

  renderSettingsMenuItems() {
    return _react.default.createElement(MenuList, {
      id: "debugger-settings-menu-list"
    }, _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-disable-javascript",
      className: "menu-item debugger-settings-menu-item-disable-javascript",
      checked: !this.props.javascriptEnabled,
      label: L10N.getStr("settings.disableJavaScript.label"),
      tooltip: L10N.getStr("settings.disableJavaScript.tooltip"),
      onClick: () => {
        this.props.toggleJavaScriptEnabled(!this.props.javascriptEnabled);
      }
    }), _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-disable-inline-previews",
      checked: _prefs.features.inlinePreview,
      label: L10N.getStr("inlinePreview.toggle.label"),
      tooltip: L10N.getStr("inlinePreview.toggle.tooltip"),
      onClick: () => this.props.toggleInlinePreview(!_prefs.features.inlinePreview)
    }), _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-disable-wrap-lines",
      checked: _prefs.prefs.editorWrapping,
      label: L10N.getStr("editorWrapping.toggle.label"),
      tooltip: L10N.getStr("editorWrapping.toggle.tooltip"),
      onClick: () => this.props.toggleEditorWrapping(!_prefs.prefs.editorWrapping)
    }), _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-disable-sourcemaps",
      checked: _prefs.prefs.clientSourceMapsEnabled,
      label: L10N.getStr("settings.toggleSourceMaps.label"),
      tooltip: L10N.getStr("settings.toggleSourceMaps.tooltip"),
      onClick: () => this.props.toggleSourceMapsEnabled(!_prefs.prefs.clientSourceMapsEnabled)
    }), _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-hide-ignored-sources",
      className: "menu-item debugger-settings-menu-item-hide-ignored-sources",
      checked: _prefs.prefs.hideIgnoredSources,
      label: L10N.getStr("settings.hideIgnoredSources.label"),
      tooltip: L10N.getStr("settings.hideIgnoredSources.tooltip"),
      onClick: () => this.props.setHideOrShowIgnoredSources(!_prefs.prefs.hideIgnoredSources)
    }), _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-enable-sourcemap-ignore-list",
      className: "menu-item debugger-settings-menu-item-enable-sourcemap-ignore-list",
      checked: _prefs.prefs.sourceMapIgnoreListEnabled,
      label: L10N.getStr("settings.enableSourceMapIgnoreList.label"),
      tooltip: L10N.getStr("settings.enableSourceMapIgnoreList.tooltip"),
      onClick: () => this.props.toggleSourceMapIgnoreList(!_prefs.prefs.sourceMapIgnoreListEnabled)
    }));
  }

  render() {
    return (0, _reactDomFactories.div)({
      className: classnames("command-bar", {
        vertical: !this.props.horizontal
      })
    }, this.renderStepButtons(), (0, _reactDomFactories.div)({
      className: "filler"
    }), this.renderTraceButton(), this.renderSkipPausingButton(), (0, _reactDomFactories.div)({
      className: "devtools-separator"
    }), this.renderSettingsButton());
  }

}

CommandBar.contextTypes = {
  shortcuts: _propTypes.default.object,
  toolboxDoc: _propTypes.default.object
};

const mapStateToProps = state => ({
  isWaitingOnBreak: (0, _selectors.getIsWaitingOnBreak)(state, (0, _selectors.getCurrentThread)(state)),
  skipPausing: (0, _selectors.getSkipPausing)(state),
  topFrameSelected: (0, _selectors.isTopFrameSelected)(state, (0, _selectors.getCurrentThread)(state)),
  javascriptEnabled: state.ui.javascriptEnabled,
  isPaused: (0, _selectors.getIsCurrentThreadPaused)(state),
  isTracingEnabled: (0, _selectors.getIsThreadCurrentlyTracing)(state, (0, _selectors.getCurrentThread)(state)),
  logMethod: (0, _selectors.getJavascriptTracingLogMethod)(state)
});

var _default = (0, _connect.connect)(mapStateToProps, {
  toggleTracing: _actions.default.toggleTracing,
  setJavascriptTracingLogMethod: _actions.default.setJavascriptTracingLogMethod,
  resume: _actions.default.resume,
  stepIn: _actions.default.stepIn,
  stepOut: _actions.default.stepOut,
  stepOver: _actions.default.stepOver,
  breakOnNext: _actions.default.breakOnNext,
  pauseOnExceptions: _actions.default.pauseOnExceptions,
  toggleSkipPausing: _actions.default.toggleSkipPausing,
  toggleInlinePreview: _actions.default.toggleInlinePreview,
  toggleEditorWrapping: _actions.default.toggleEditorWrapping,
  toggleSourceMapsEnabled: _actions.default.toggleSourceMapsEnabled,
  toggleJavaScriptEnabled: _actions.default.toggleJavaScriptEnabled,
  setHideOrShowIgnoredSources: _actions.default.setHideOrShowIgnoredSources,
  toggleSourceMapIgnoreList: _actions.default.toggleSourceMapIgnoreList
})(CommandBar);

exports.default = _default;