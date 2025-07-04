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
loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");

var _actions = _interopRequireDefault(require("../actions/index"));

var _AccessibleImage = _interopRequireDefault(require("./shared/AccessibleImage"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_ShortcutsModal", "devtools/client/debugger/src/components/ShortcutsModal");

var _PrimaryPanes = _interopRequireDefault(require("./PrimaryPanes/index"));

var _Editor = _interopRequireDefault(require("./Editor/index"));

var _SecondaryPanes = _interopRequireDefault(require("./SecondaryPanes/index"));

var _WelcomeBox = _interopRequireDefault(require("./WelcomeBox"));

var _Tabs = _interopRequireDefault(require("./Editor/Tabs"));

var _Footer = _interopRequireDefault(require("./Editor/Footer"));

var _QuickOpenModal = _interopRequireDefault(require("./QuickOpenModal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const KeyShortcuts = require("devtools/client/shared/key-shortcuts");

const SplitBox = require("devtools/client/shared/components/splitter/SplitBox");

const AppErrorBoundary = require("devtools/client/shared/components/AppErrorBoundary");

const shortcuts = new KeyShortcuts({
  window
});
const horizontalLayoutBreakpoint = window.matchMedia("(min-width: 800px)");
const verticalLayoutBreakpoint = window.matchMedia("(min-width: 10px) and (max-width: 799px)");

class App extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "jumpToProjectSearch", e => {
      e.preventDefault();
      this.props.setPrimaryPaneTab(_constants.primaryPaneTabs.PROJECT_SEARCH);
      this.props.setActiveSearch(_constants.primaryPaneTabs.PROJECT_SEARCH);
    });

    _defineProperty(this, "onEscape", e => {
      const {
        activeSearch,
        closeActiveSearch,
        closeQuickOpen,
        quickOpenEnabled
      } = this.props;
      const {
        shortcutsModalEnabled
      } = this.state;

      if (activeSearch) {
        e.preventDefault();
        closeActiveSearch();
      }

      if (quickOpenEnabled) {
        e.preventDefault();
        closeQuickOpen();
      }

      if (shortcutsModalEnabled) {
        e.preventDefault();
        this.toggleShortcutsModal();
      }
    });

    _defineProperty(this, "onCommandSlash", () => {
      this.toggleShortcutsModal();
    });

    _defineProperty(this, "toggleQuickOpenModal", (e, query) => {
      const {
        quickOpenEnabled,
        openQuickOpen,
        closeQuickOpen
      } = this.props;
      e.preventDefault();
      e.stopPropagation();

      if (quickOpenEnabled === true) {
        closeQuickOpen();
        return;
      }

      if (query != null) {
        openQuickOpen(query);
        return;
      }

      openQuickOpen();
    });

    _defineProperty(this, "onLayoutChange", () => {
      this.setOrientation();
    });

    _defineProperty(this, "renderEditorPane", () => {
      const {
        startPanelCollapsed,
        endPanelCollapsed
      } = this.props;
      const {
        endPanelSize,
        startPanelSize
      } = this.state;
      const horizontal = this.isHorizontal();
      return (0, _reactDomFactories.main)({
        className: "editor-pane"
      }, (0, _reactDomFactories.div)({
        className: "editor-container"
      }, _react.default.createElement(_Tabs.default, {
        startPanelCollapsed: startPanelCollapsed,
        endPanelCollapsed: endPanelCollapsed,
        horizontal: horizontal
      }), _react.default.createElement(_Editor.default, {
        startPanelSize: startPanelSize,
        endPanelSize: endPanelSize
      }), !this.props.selectedSource ? _react.default.createElement(_WelcomeBox.default, {
        horizontal,
        toggleShortcutsModal: () => this.toggleShortcutsModal()
      }) : null, this.renderEditorNotificationBar(), _react.default.createElement(_Footer.default, {
        horizontal
      })));
    });

    _defineProperty(this, "renderLayout", () => {
      const {
        startPanelCollapsed,
        endPanelCollapsed
      } = this.props;
      const horizontal = this.isHorizontal();
      return _react.default.createElement(SplitBox, {
        style: {
          width: "100vw"
        },
        initialSize: _prefs.prefs.endPanelSize,
        minSize: 30,
        maxSize: "70%",
        splitterSize: 1,
        vert: horizontal,
        onResizeEnd: num => {
          _prefs.prefs.endPanelSize = num;
          this.triggerEditorPaneResize();
        },
        startPanel: _react.default.createElement(SplitBox, {
          style: {
            width: "100vw"
          },
          initialSize: _prefs.prefs.startPanelSize,
          minSize: 30,
          maxSize: "85%",
          splitterSize: 1,
          onResizeEnd: num => {
            _prefs.prefs.startPanelSize = num;
            this.triggerEditorPaneResize();
          },
          startPanelCollapsed: startPanelCollapsed,
          startPanel: _react.default.createElement(_PrimaryPanes.default, {
            horizontal
          }),
          endPanel: this.renderEditorPane()
        }),
        endPanelControl: true,
        endPanel: _react.default.createElement(_SecondaryPanes.default, {
          horizontal
        }),
        endPanelCollapsed: endPanelCollapsed
      });
    });

    this.state = {
      shortcutsModalEnabled: false,
      startPanelSize: 0,
      endPanelSize: 0
    };
  }

  static get propTypes() {
    return {
      activeSearch: _propTypes.default.oneOf(["file", "project"]),
      closeActiveSearch: _propTypes.default.func.isRequired,
      closeQuickOpen: _propTypes.default.func.isRequired,
      endPanelCollapsed: _propTypes.default.bool.isRequired,
      fluentBundles: _propTypes.default.array.isRequired,
      openQuickOpen: _propTypes.default.func.isRequired,
      orientation: _propTypes.default.oneOf(["horizontal", "vertical"]).isRequired,
      quickOpenEnabled: _propTypes.default.bool.isRequired,
      selectedSource: _propTypes.default.object,
      setActiveSearch: _propTypes.default.func.isRequired,
      setOrientation: _propTypes.default.func.isRequired,
      setPrimaryPaneTab: _propTypes.default.func.isRequired,
      startPanelCollapsed: _propTypes.default.bool.isRequired,
      toolboxDoc: _propTypes.default.object.isRequired,
      showOriginalVariableMappingWarning: _propTypes.default.bool
    };
  }

  getChildContext() {
    return {
      fluentBundles: this.props.fluentBundles,
      toolboxDoc: this.props.toolboxDoc,
      shortcuts,
      l10n: L10N
    };
  }

  componentDidMount() {
    horizontalLayoutBreakpoint.addListener(this.onLayoutChange);
    verticalLayoutBreakpoint.addListener(this.onLayoutChange);
    this.setOrientation();
    shortcuts.on(L10N.getStr("symbolSearch.search.key2"), e => this.toggleQuickOpenModal(e, "@"));
    [L10N.getStr("sources.search.key2"), L10N.getStr("sources.search.alt.key")].forEach(key => shortcuts.on(key, this.toggleQuickOpenModal));
    shortcuts.on(L10N.getStr("gotoLineModal.key3"), e => this.toggleQuickOpenModal(e, ":"));
    shortcuts.on(L10N.getStr("projectTextSearch.key"), this.jumpToProjectSearch);
    shortcuts.on("Escape", this.onEscape);
    shortcuts.on("CmdOrCtrl+/", this.onCommandSlash);
  }

  componentWillUnmount() {
    horizontalLayoutBreakpoint.removeListener(this.onLayoutChange);
    verticalLayoutBreakpoint.removeListener(this.onLayoutChange);
    shortcuts.off(L10N.getStr("symbolSearch.search.key2"), this.toggleQuickOpenModal);
    [L10N.getStr("sources.search.key2"), L10N.getStr("sources.search.alt.key")].forEach(key => shortcuts.off(key, this.toggleQuickOpenModal));
    shortcuts.off(L10N.getStr("gotoLineModal.key3"), this.toggleQuickOpenModal);
    shortcuts.off(L10N.getStr("projectTextSearch.key"), this.jumpToProjectSearch);
    shortcuts.off("Escape", this.onEscape);
    shortcuts.off("CmdOrCtrl+/", this.onCommandSlash);
  }

  isHorizontal() {
    return this.props.orientation === "horizontal";
  }

  setOrientation() {
    // If the orientation does not match (if it is not visible) it will
    // not setOrientation, or if it is the same as before, calling
    // setOrientation will not cause a rerender.
    if (horizontalLayoutBreakpoint.matches) {
      this.props.setOrientation("horizontal");
    } else if (verticalLayoutBreakpoint.matches) {
      this.props.setOrientation("vertical");
    }
  }

  renderEditorNotificationBar() {
    if (this.props.showOriginalVariableMappingWarning) {
      return (0, _reactDomFactories.div)({
        className: "editor-notification-footer",
        "aria-role": "status"
      }, (0, _reactDomFactories.span)({
        className: "info icon"
      }, _react.default.createElement(_AccessibleImage.default, {
        className: "sourcemap"
      })), L10N.getFormatStr("editorNotificationFooter.noOriginalScopes", L10N.getStr("scopes.showOriginalScopes")));
    }

    return null;
  }

  toggleShortcutsModal() {
    this.setState(prevState => ({
      shortcutsModalEnabled: !prevState.shortcutsModalEnabled
    }));
  } // Important so that the tabs chevron updates appropriately when
  // the user resizes the left or right columns


  triggerEditorPaneResize() {
    const editorPane = window.document.querySelector(".editor-pane");

    if (editorPane) {
      editorPane.dispatchEvent(new Event("resizeend"));
    }
  }

  render() {
    const {
      quickOpenEnabled
    } = this.props;
    return (0, _reactDomFactories.div)({
      className: "debugger"
    }, _react.default.createElement(AppErrorBoundary, {
      componentName: "Debugger",
      panel: L10N.getStr("ToolboxDebugger.label")
    }, this.renderLayout(), quickOpenEnabled === true && _react.default.createElement(_QuickOpenModal.default, {
      shortcutsModalEnabled: this.state.shortcutsModalEnabled,
      toggleShortcutsModal: () => this.toggleShortcutsModal()
    }), _react.default.createElement(_ShortcutsModal.ShortcutsModal, {
      enabled: this.state.shortcutsModalEnabled,
      handleClose: () => this.toggleShortcutsModal()
    })));
  }

}

App.childContextTypes = {
  toolboxDoc: _propTypes.default.object,
  shortcuts: _propTypes.default.object,
  l10n: _propTypes.default.object,
  fluentBundles: _propTypes.default.array
};

const mapStateToProps = state => {
  const selectedSource = (0, _selectors.getSelectedSource)(state);
  const mapScopeEnabled = (0, _selectors.isMapScopesEnabled)(state);
  const isPaused = (0, _selectors.getIsCurrentThreadPaused)(state);
  const showOriginalVariableMappingWarning = isPaused && (selectedSource === null || selectedSource === void 0 ? void 0 : selectedSource.isOriginal) && !selectedSource.isPrettyPrinted && !mapScopeEnabled;
  return {
    showOriginalVariableMappingWarning,
    selectedSource,
    startPanelCollapsed: (0, _selectors.getPaneCollapse)(state, "start"),
    endPanelCollapsed: (0, _selectors.getPaneCollapse)(state, "end"),
    activeSearch: (0, _selectors.getActiveSearch)(state),
    quickOpenEnabled: (0, _selectors.getQuickOpenEnabled)(state),
    orientation: (0, _selectors.getOrientation)(state)
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  setActiveSearch: _actions.default.setActiveSearch,
  closeActiveSearch: _actions.default.closeActiveSearch,
  openQuickOpen: _actions.default.openQuickOpen,
  closeQuickOpen: _actions.default.closeQuickOpen,
  setOrientation: _actions.default.setOrientation,
  setPrimaryPaneTab: _actions.default.setPrimaryPaneTab
})(App);

exports.default = _default;