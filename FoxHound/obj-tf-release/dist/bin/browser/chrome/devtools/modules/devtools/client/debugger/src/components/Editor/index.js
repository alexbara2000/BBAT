"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _redux = require("devtools/client/shared/vendor/redux");

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_indentation", "devtools/client/debugger/src/utils/indentation");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _actions = _interopRequireDefault(require("../../actions/index"));

var _SearchInFileBar = _interopRequireDefault(require("./SearchInFileBar"));

var _HighlightLines = _interopRequireDefault(require("./HighlightLines"));

var _Preview = _interopRequireDefault(require("./Preview/index"));

var _Breakpoints = _interopRequireDefault(require("./Breakpoints"));

var _ColumnBreakpoints = _interopRequireDefault(require("./ColumnBreakpoints"));

var _DebugLine = _interopRequireDefault(require("./DebugLine"));

var _HighlightLine = _interopRequireDefault(require("./HighlightLine"));

var _EmptyLines = _interopRequireDefault(require("./EmptyLines"));

var _ConditionalPanel = _interopRequireDefault(require("./ConditionalPanel"));

var _InlinePreviews = _interopRequireDefault(require("./InlinePreviews"));

var _Exceptions = _interopRequireDefault(require("./Exceptions"));

var _BlackboxLines = _interopRequireDefault(require("./BlackboxLines"));

loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/utils/ui");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  debounce
} = require("devtools/shared/debounce");

const classnames = require("devtools/client/shared/classnames.js");

const {
  appinfo
} = Services;
const isMacOS = appinfo.OS === "Darwin";

function isSecondary(ev) {
  return isMacOS && ev.ctrlKey && ev.button === 0;
}

function isCmd(ev) {
  return isMacOS ? ev.metaKey : ev.ctrlKey;
}

const cssVars = {
  searchbarHeight: "var(--editor-searchbar-height)"
};

class Editor extends _react.PureComponent {
  static get propTypes() {
    return {
      selectedSource: _propTypes.default.object,
      selectedSourceTextContent: _propTypes.default.object,
      selectedSourceIsBlackBoxed: _propTypes.default.bool,
      closeTab: _propTypes.default.func.isRequired,
      toggleBreakpointAtLine: _propTypes.default.func.isRequired,
      conditionalPanelLocation: _propTypes.default.object,
      closeConditionalPanel: _propTypes.default.func.isRequired,
      openConditionalPanel: _propTypes.default.func.isRequired,
      updateViewport: _propTypes.default.func.isRequired,
      isPaused: _propTypes.default.bool.isRequired,
      addBreakpointAtLine: _propTypes.default.func.isRequired,
      continueToHere: _propTypes.default.func.isRequired,
      updateCursorPosition: _propTypes.default.func.isRequired,
      jumpToMappedLocation: _propTypes.default.func.isRequired,
      selectedLocation: _propTypes.default.object,
      symbols: _propTypes.default.object,
      startPanelSize: _propTypes.default.number.isRequired,
      endPanelSize: _propTypes.default.number.isRequired,
      searchInFileEnabled: _propTypes.default.bool.isRequired,
      inlinePreviewEnabled: _propTypes.default.bool.isRequired,
      skipPausing: _propTypes.default.bool.isRequired,
      blackboxedRanges: _propTypes.default.object.isRequired,
      breakableLines: _propTypes.default.object.isRequired,
      highlightedLineRange: _propTypes.default.object,
      isSourceOnIgnoreList: _propTypes.default.bool,
      mapScopesEnabled: _propTypes.default.bool
    };
  }

  constructor(props) {
    super(props);

    _defineProperty(this, "$editorWrapper", void 0);

    _defineProperty(this, "onCloseShortcutPress", e => {
      const {
        selectedSource
      } = this.props;

      if (selectedSource) {
        e.preventDefault();
        e.stopPropagation();
        this.props.closeTab(selectedSource, "shortcut");
      }
    });

    _defineProperty(this, "onToggleBreakpoint", e => {
      e.preventDefault();
      e.stopPropagation();
      const line = this.getCurrentLine();

      if (typeof line !== "number") {
        return;
      }

      this.props.toggleBreakpointAtLine(line);
    });

    _defineProperty(this, "onToggleConditionalPanel", e => {
      e.stopPropagation();
      e.preventDefault();
      const {
        conditionalPanelLocation,
        closeConditionalPanel,
        openConditionalPanel,
        selectedSource
      } = this.props;
      const line = this.getCurrentLine();
      const {
        codeMirror
      } = this.state.editor; // add one to column for correct position in editor.

      const column = (0, _editor.getCursorColumn)(codeMirror) + 1;

      if (conditionalPanelLocation) {
        return closeConditionalPanel();
      }

      if (!selectedSource || typeof line !== "number") {
        return null;
      }

      return openConditionalPanel((0, _location.createLocation)({
        line,
        column,
        source: selectedSource
      }), false);
    });

    _defineProperty(this, "onEditorScroll", debounce(this.props.updateViewport, 75));

    _defineProperty(this, "onEscape", e => {
      if (!this.state.editor) {
        return;
      }

      const {
        codeMirror
      } = this.state.editor;

      if (codeMirror.listSelections().length > 1) {
        codeMirror.execCommand("singleSelection");
        e.preventDefault();
      }
    });

    _defineProperty(this, "onGutterClick", (cm, line, gutter, ev) => {
      const {
        selectedSource,
        conditionalPanelLocation,
        closeConditionalPanel,
        addBreakpointAtLine,
        continueToHere,
        breakableLines,
        blackboxedRanges,
        isSourceOnIgnoreList
      } = this.props; // ignore right clicks in the gutter

      if (isSecondary(ev) || ev.button === 2 || !selectedSource) {
        return;
      }

      if (conditionalPanelLocation) {
        closeConditionalPanel();
        return;
      }

      if (gutter === "CodeMirror-foldgutter") {
        return;
      }

      const sourceLine = (0, _editor.toSourceLine)(selectedSource.id, line);

      if (typeof sourceLine !== "number") {
        return;
      } // ignore clicks on a non-breakable line


      if (!breakableLines.has(sourceLine)) {
        return;
      }

      if (isCmd(ev)) {
        continueToHere((0, _location.createLocation)({
          line: sourceLine,
          column: undefined,
          source: selectedSource
        }));
        return;
      }

      addBreakpointAtLine(sourceLine, ev.altKey, ev.shiftKey || (0, _source.isLineBlackboxed)(blackboxedRanges[selectedSource.url], sourceLine, isSourceOnIgnoreList));
    });

    _defineProperty(this, "onGutterContextMenu", event => {
      this.openMenu(event);
    });

    this.state = {
      editor: null
    };
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillReceiveProps(nextProps) {
    var _nextProps$selectedSo, _this$props$selectedS;

    let {
      editor
    } = this.state;

    if (!editor && nextProps.selectedSource) {
      editor = this.setupEditor();
    }

    const shouldUpdateText = nextProps.selectedSource !== this.props.selectedSource || ((_nextProps$selectedSo = nextProps.selectedSourceTextContent) === null || _nextProps$selectedSo === void 0 ? void 0 : _nextProps$selectedSo.value) !== ((_this$props$selectedS = this.props.selectedSourceTextContent) === null || _this$props$selectedS === void 0 ? void 0 : _this$props$selectedS.value) || nextProps.symbols !== this.props.symbols;
    const shouldUpdateSize = nextProps.startPanelSize !== this.props.startPanelSize || nextProps.endPanelSize !== this.props.endPanelSize;
    const shouldScroll = nextProps.selectedLocation && this.shouldScrollToLocation(nextProps, editor);

    if (shouldUpdateText || shouldUpdateSize || shouldScroll) {
      (0, _editor.startOperation)();

      if (shouldUpdateText) {
        this.setText(nextProps, editor);
      }

      if (shouldUpdateSize) {
        editor.codeMirror.setSize();
      }

      if (shouldScroll) {
        this.scrollToLocation(nextProps, editor);
      }

      (0, _editor.endOperation)();
    }

    if (this.props.selectedSource != nextProps.selectedSource) {
      this.props.updateViewport();
      (0, _ui.resizeBreakpointGutter)(editor.codeMirror);
      (0, _ui.resizeToggleButton)(editor.codeMirror);
    }
  }

  setupEditor() {
    const editor = (0, _editor.getEditor)(); // disables the default search shortcuts

    editor._initShortcuts = () => {};

    const node = _reactDom.default.findDOMNode(this);

    if (node instanceof HTMLElement) {
      editor.appendToLocalElement(node.querySelector(".editor-mount"));
    }

    const {
      codeMirror
    } = editor;
    this.abortController = new window.AbortController(); // CodeMirror refreshes its internal state on window resize, but we need to also
    // refresh it when the side panels are resized.
    // We could have a ResizeObserver instead, but we wouldn't be able to differentiate
    // between window resize and side panel resize and as a result, might refresh
    // codeMirror twice, which is wasteful.

    window.document.querySelector(".editor-pane").addEventListener("resizeend", () => codeMirror.refresh(), {
      signal: this.abortController.signal
    });
    codeMirror.on("gutterClick", this.onGutterClick);
    const codeMirrorWrapper = codeMirror.getWrapperElement(); // Set code editor wrapper to be focusable

    codeMirrorWrapper.tabIndex = 0;
    codeMirrorWrapper.addEventListener("keydown", e => this.onKeyDown(e));
    codeMirrorWrapper.addEventListener("click", e => this.onClick(e));
    codeMirrorWrapper.addEventListener("mouseover", (0, _editor.onMouseOver)(codeMirror));

    const toggleFoldMarkerVisibility = e => {
      if (node instanceof HTMLElement) {
        node.querySelectorAll(".CodeMirror-guttermarker-subtle").forEach(elem => {
          elem.classList.toggle("visible");
        });
      }
    };

    const codeMirrorGutter = codeMirror.getGutterElement();
    codeMirrorGutter.addEventListener("mouseleave", toggleFoldMarkerVisibility);
    codeMirrorGutter.addEventListener("mouseenter", toggleFoldMarkerVisibility);
    codeMirrorWrapper.addEventListener("contextmenu", event => this.openMenu(event));
    codeMirror.on("scroll", this.onEditorScroll);
    this.onEditorScroll();
    this.setState({
      editor
    });
    return editor;
  }

  componentDidMount() {
    const {
      shortcuts
    } = this.context;
    shortcuts.on(L10N.getStr("toggleBreakpoint.key"), this.onToggleBreakpoint);
    shortcuts.on(L10N.getStr("toggleCondPanel.breakpoint.key"), this.onToggleConditionalPanel);
    shortcuts.on(L10N.getStr("toggleCondPanel.logPoint.key"), this.onToggleConditionalPanel);
    shortcuts.on(L10N.getStr("sourceTabs.closeTab.key"), this.onCloseShortcutPress);
    shortcuts.on("Esc", this.onEscape);
  }

  componentWillUnmount() {
    const {
      editor
    } = this.state;

    if (editor) {
      editor.destroy();
      editor.codeMirror.off("scroll", this.onEditorScroll);
      this.setState({
        editor: null
      });
    }

    const {
      shortcuts
    } = this.context;
    shortcuts.off(L10N.getStr("sourceTabs.closeTab.key"));
    shortcuts.off(L10N.getStr("toggleBreakpoint.key"));
    shortcuts.off(L10N.getStr("toggleCondPanel.breakpoint.key"));
    shortcuts.off(L10N.getStr("toggleCondPanel.logPoint.key"));

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  getCurrentLine() {
    const {
      codeMirror
    } = this.state.editor;
    const {
      selectedSource
    } = this.props;

    if (!selectedSource) {
      return null;
    }

    const line = (0, _editor.getCursorLine)(codeMirror);
    return (0, _editor.toSourceLine)(selectedSource.id, line);
  }

  onKeyDown(e) {
    const {
      codeMirror
    } = this.state.editor;
    const {
      key,
      target
    } = e;
    const codeWrapper = codeMirror.getWrapperElement();
    const textArea = codeWrapper.querySelector("textArea");

    if (key === "Escape" && target == textArea) {
      e.stopPropagation();
      e.preventDefault();
      codeWrapper.focus();
    } else if (key === "Enter" && target == codeWrapper) {
      e.preventDefault(); // Focus into editor's text area

      textArea.focus();
    }
  }
  /*
   * The default Esc command is overridden in the CodeMirror keymap to allow
   * the Esc keypress event to be catched by the toolbox and trigger the
   * split console. Restore it here, but preventDefault if and only if there
   * is a multiselection.
   */


  openMenu(event) {
    event.stopPropagation();
    event.preventDefault();
    const {
      selectedSource,
      selectedSourceTextContent,
      conditionalPanelLocation,
      closeConditionalPanel
    } = this.props;
    const {
      editor
    } = this.state;

    if (!selectedSource || !editor) {
      return;
    } // only allow one conditionalPanel location.


    if (conditionalPanelLocation) {
      closeConditionalPanel();
    }

    const target = event.target;
    const {
      id: sourceId
    } = selectedSource;
    const line = (0, _editor.lineAtHeight)(editor, sourceId, event);

    if (typeof line != "number") {
      return;
    }

    if (target.classList.contains("CodeMirror-linenumber")) {
      const location = (0, _location.createLocation)({
        line,
        column: undefined,
        source: selectedSource
      });
      const lineText = (0, _source.getLineText)(sourceId, selectedSourceTextContent, line).trim();
      this.props.showEditorGutterContextMenu(event, editor, location, lineText);
      return;
    }

    if (target.getAttribute("id") === "columnmarker") {
      return;
    }

    const location = (0, _editor.getSourceLocationFromMouseEvent)(editor, selectedSource, event);
    this.props.showEditorContextMenu(event, editor, location);
  }

  onClick(e) {
    const {
      selectedSource,
      updateCursorPosition,
      jumpToMappedLocation
    } = this.props;

    if (selectedSource) {
      const sourceLocation = (0, _editor.getSourceLocationFromMouseEvent)(this.state.editor, selectedSource, e);

      if (e.metaKey && e.altKey) {
        jumpToMappedLocation(sourceLocation);
      }

      updateCursorPosition(sourceLocation);
    }
  }

  shouldScrollToLocation(nextProps, editor) {
    var _nextProps$selectedLo, _nextProps$selectedSo2;

    if (!((_nextProps$selectedLo = nextProps.selectedLocation) === null || _nextProps$selectedLo === void 0 ? void 0 : _nextProps$selectedLo.line) || !nextProps.selectedSourceTextContent) {
      return false;
    }

    const {
      selectedLocation,
      selectedSourceTextContent
    } = this.props;
    const contentChanged = !(selectedSourceTextContent === null || selectedSourceTextContent === void 0 ? void 0 : selectedSourceTextContent.value) && ((_nextProps$selectedSo2 = nextProps.selectedSourceTextContent) === null || _nextProps$selectedSo2 === void 0 ? void 0 : _nextProps$selectedSo2.value);
    const locationChanged = selectedLocation !== nextProps.selectedLocation;
    const symbolsChanged = nextProps.symbols != this.props.symbols;
    return contentChanged || locationChanged || symbolsChanged;
  }

  scrollToLocation(nextProps, editor) {
    const {
      selectedLocation,
      selectedSource
    } = nextProps;
    let {
      line,
      column
    } = (0, _editor.toEditorPosition)(selectedLocation);

    if (selectedSource && (0, _editor.hasDocument)(selectedSource.id)) {
      const doc = (0, _editor.getDocument)(selectedSource.id);
      const lineText = doc.getLine(line);
      column = Math.max(column, (0, _indentation.getIndentation)(lineText));
    }

    (0, _editor.scrollToPosition)(editor.codeMirror, line, column);
  }

  setText(props, editor) {
    const {
      selectedSource,
      selectedSourceTextContent,
      symbols
    } = props;

    if (!editor) {
      return;
    } // check if we previously had a selected source


    if (!selectedSource) {
      this.clearEditor();
      return;
    }

    if (!(selectedSourceTextContent === null || selectedSourceTextContent === void 0 ? void 0 : selectedSourceTextContent.value)) {
      (0, _editor.showLoading)(editor);
      return;
    }

    if (selectedSourceTextContent.state === "rejected") {
      let {
        value
      } = selectedSourceTextContent;

      if (typeof value !== "string") {
        value = "Unexpected source error";
      }

      this.showErrorMessage(value);
      return;
    }

    (0, _editor.showSourceText)(editor, selectedSource, selectedSourceTextContent, symbols);
  }

  clearEditor() {
    const {
      editor
    } = this.state;

    if (!editor) {
      return;
    }

    (0, _editor.clearEditor)(editor);
  }

  showErrorMessage(msg) {
    const {
      editor
    } = this.state;

    if (!editor) {
      return;
    }

    (0, _editor.showErrorMessage)(editor, msg);
  }

  getInlineEditorStyles() {
    const {
      searchInFileEnabled
    } = this.props;

    if (searchInFileEnabled) {
      return {
        height: `calc(100% - ${cssVars.searchbarHeight})`
      };
    }

    return {
      height: "100%"
    };
  }

  renderItems() {
    const {
      selectedSource,
      conditionalPanelLocation,
      isPaused,
      inlinePreviewEnabled,
      highlightedLineRange,
      blackboxedRanges,
      isSourceOnIgnoreList,
      selectedSourceIsBlackBoxed,
      mapScopesEnabled
    } = this.props;
    const {
      editor
    } = this.state;

    if (!selectedSource || !editor || !(0, _editor.getDocument)(selectedSource.id)) {
      return null;
    }

    return (0, _reactDomFactories.div)(null, _react.default.createElement(_DebugLine.default, null), _react.default.createElement(_HighlightLine.default, null), _react.default.createElement(_EmptyLines.default, {
      editor
    }), _react.default.createElement(_Breakpoints.default, {
      editor
    }), isPaused && selectedSource.isOriginal && !selectedSource.isPrettyPrinted && !mapScopesEnabled ? null : _react.default.createElement(_Preview.default, {
      editor,
      editorRef: this.$editorWrapper
    }), highlightedLineRange ? _react.default.createElement(_HighlightLines.default, {
      editor,
      range: highlightedLineRange
    }) : null, isSourceOnIgnoreList || selectedSourceIsBlackBoxed ? _react.default.createElement(_BlackboxLines.default, {
      editor,
      selectedSource,
      isSourceOnIgnoreList,
      blackboxedRangesForSelectedSource: blackboxedRanges[selectedSource.url]
    }) : null, _react.default.createElement(_Exceptions.default, null), conditionalPanelLocation ? _react.default.createElement(_ConditionalPanel.default, {
      editor
    }) : null, _react.default.createElement(_ColumnBreakpoints.default, {
      editor
    }), isPaused && inlinePreviewEnabled && (!selectedSource.isOriginal || selectedSource.isOriginal && selectedSource.isPrettyPrinted || selectedSource.isOriginal && mapScopesEnabled) ? _react.default.createElement(_InlinePreviews.default, {
      editor,
      selectedSource
    }) : null);
  }

  renderSearchInFileBar() {
    if (!this.props.selectedSource) {
      return null;
    }

    return _react.default.createElement(_SearchInFileBar.default, {
      editor: this.state.editor
    });
  }

  render() {
    const {
      selectedSourceIsBlackBoxed,
      skipPausing
    } = this.props;
    return (0, _reactDomFactories.div)({
      className: classnames("editor-wrapper", {
        blackboxed: selectedSourceIsBlackBoxed,
        "skip-pausing": skipPausing
      }),
      ref: c => this.$editorWrapper = c
    }, (0, _reactDomFactories.div)({
      className: "editor-mount devtools-monospace",
      style: this.getInlineEditorStyles()
    }), this.renderSearchInFileBar(), this.renderItems());
  }

}

Editor.contextTypes = {
  shortcuts: _propTypes.default.object
};

const mapStateToProps = state => {
  const selectedSource = (0, _selectors.getSelectedSource)(state);
  const selectedLocation = (0, _selectors.getSelectedLocation)(state);
  return {
    selectedLocation,
    selectedSource,
    selectedSourceTextContent: (0, _selectors.getSelectedSourceTextContent)(state),
    selectedSourceIsBlackBoxed: selectedSource ? (0, _selectors.isSourceBlackBoxed)(state, selectedSource) : null,
    isSourceOnIgnoreList: (0, _selectors.isSourceMapIgnoreListEnabled)(state) && (0, _selectors.isSourceOnSourceMapIgnoreList)(state, selectedSource),
    searchInFileEnabled: (0, _selectors.getActiveSearch)(state) === "file",
    conditionalPanelLocation: (0, _selectors.getConditionalPanelLocation)(state),
    symbols: (0, _selectors.getSymbols)(state, selectedLocation),
    isPaused: (0, _selectors.getIsCurrentThreadPaused)(state),
    skipPausing: (0, _selectors.getSkipPausing)(state),
    inlinePreviewEnabled: (0, _selectors.getInlinePreview)(state),
    blackboxedRanges: (0, _selectors.getBlackBoxRanges)(state),
    breakableLines: (0, _selectors.getSelectedBreakableLines)(state),
    highlightedLineRange: (0, _selectors.getHighlightedLineRangeForSelectedSource)(state),
    mapScopesEnabled: (selectedSource === null || selectedSource === void 0 ? void 0 : selectedSource.isOriginal) ? (0, _selectors.isMapScopesEnabled)(state) : null
  };
};

const mapDispatchToProps = dispatch => ({ ...(0, _redux.bindActionCreators)({
    openConditionalPanel: _actions.default.openConditionalPanel,
    closeConditionalPanel: _actions.default.closeConditionalPanel,
    continueToHere: _actions.default.continueToHere,
    toggleBreakpointAtLine: _actions.default.toggleBreakpointAtLine,
    addBreakpointAtLine: _actions.default.addBreakpointAtLine,
    jumpToMappedLocation: _actions.default.jumpToMappedLocation,
    updateViewport: _actions.default.updateViewport,
    updateCursorPosition: _actions.default.updateCursorPosition,
    closeTab: _actions.default.closeTab,
    showEditorContextMenu: _actions.default.showEditorContextMenu,
    showEditorGutterContextMenu: _actions.default.showEditorGutterContextMenu
  }, dispatch)
});

var _default = (0, _connect.connect)(mapStateToProps, mapDispatchToProps)(Editor);

exports.default = _default;