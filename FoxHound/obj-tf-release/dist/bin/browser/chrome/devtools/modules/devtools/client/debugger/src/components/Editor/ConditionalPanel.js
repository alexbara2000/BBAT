"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ConditionalPanel = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

function addNewLine(doc) {
  const cursor = doc.getCursor();
  const pos = {
    line: cursor.line,
    ch: cursor.ch
  };
  doc.replaceRange("\n", pos);
}

class ConditionalPanel extends _react.PureComponent {
  constructor() {
    super();

    _defineProperty(this, "cbPanel", void 0);

    _defineProperty(this, "input", void 0);

    _defineProperty(this, "codeMirror", void 0);

    _defineProperty(this, "panelNode", void 0);

    _defineProperty(this, "scrollParent", void 0);

    _defineProperty(this, "saveAndClose", () => {
      if (this.input) {
        this.setBreakpoint(this.input.value.trim());
      }

      this.props.closeConditionalPanel();
    });

    _defineProperty(this, "onKey", e => {
      if (e.key === "Enter") {
        if (this.codeMirror && e.altKey) {
          addNewLine(this.codeMirror.doc);
        } else {
          this.saveAndClose();
        }
      } else if (e.key === "Escape") {
        this.props.closeConditionalPanel();
      }
    });

    _defineProperty(this, "repositionOnScroll", () => {
      if (this.panelNode && this.scrollParent) {
        const {
          scrollLeft
        } = this.scrollParent;
        this.panelNode.style.transform = `translateX(${scrollLeft}px)`;
      }
    });

    _defineProperty(this, "createEditor", input => {
      const {
        log,
        editor,
        closeConditionalPanel
      } = this.props;
      const codeMirror = editor.CodeMirror.fromTextArea(input, {
        mode: "javascript",
        theme: "mozilla",
        placeholder: L10N.getStr(log ? "editor.conditionalPanel.logPoint.placeholder2" : "editor.conditionalPanel.placeholder2"),
        cursorBlinkRate: _prefs.prefs.cursorBlinkRate
      });
      codeMirror.on("keydown", (cm, e) => {
        if (e.key === "Enter") {
          e.codemirrorIgnore = true;
        }
      });
      codeMirror.on("blur", (cm, e) => {
        if ((e === null || e === void 0 ? void 0 : e.relatedTarget) && e.relatedTarget.closest(".conditional-breakpoint-panel")) {
          return;
        }

        closeConditionalPanel();
      });
      const codeMirrorWrapper = codeMirror.getWrapperElement();
      codeMirrorWrapper.addEventListener("keydown", e => {
        codeMirror.save();
        this.onKey(e);
      });
      this.input = input;
      this.codeMirror = codeMirror;
      codeMirror.focus();
      codeMirror.setCursor(codeMirror.lineCount(), 0);
    });

    this.cbPanel = null;
  }

  static get propTypes() {
    return {
      breakpoint: _propTypes.default.object,
      closeConditionalPanel: _propTypes.default.func.isRequired,
      editor: _propTypes.default.object.isRequired,
      location: _propTypes.default.any.isRequired,
      log: _propTypes.default.bool.isRequired,
      openConditionalPanel: _propTypes.default.func.isRequired,
      setBreakpointOptions: _propTypes.default.func.isRequired
    };
  }

  keepFocusOnInput() {
    if (this.input) {
      this.input.focus();
    }
  }

  setBreakpoint(value) {
    const {
      log,
      breakpoint
    } = this.props; // If breakpoint is `pending`, props will not contain a breakpoint.
    // If source is a URL without location, breakpoint will contain no generatedLocation.

    const location = breakpoint && breakpoint.generatedLocation ? breakpoint.generatedLocation : this.props.location;
    const options = breakpoint ? breakpoint.options : {};
    const type = log ? "logValue" : "condition";
    return this.props.setBreakpointOptions(location, { ...options,
      [type]: value
    });
  }

  clearConditionalPanel() {
    if (this.cbPanel) {
      this.cbPanel.clear();
      this.cbPanel = null;
    }

    if (this.scrollParent) {
      this.scrollParent.removeEventListener("scroll", this.repositionOnScroll);
    }
  }

  // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507
  UNSAFE_componentWillMount() {
    return this.renderToWidget(this.props);
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillUpdate() {
    return this.clearConditionalPanel();
  }

  componentDidUpdate(prevProps) {
    this.keepFocusOnInput();
  }

  componentWillUnmount() {
    // This is called if CodeMirror is re-initializing itself before the
    // user closes the conditional panel. Clear the widget, and re-render it
    // as soon as this component gets remounted
    return this.clearConditionalPanel();
  }

  renderToWidget(props) {
    if (this.cbPanel) {
      this.clearConditionalPanel();
    }

    const {
      location,
      editor
    } = props;
    const editorLine = (0, _editor.toEditorLine)(location.source.id, location.line || 0);
    this.cbPanel = editor.codeMirror.addLineWidget(editorLine, this.renderConditionalPanel(props), {
      coverGutter: true,
      noHScroll: true
    });

    if (this.input) {
      let parent = this.input.parentNode;

      while (parent) {
        if (parent instanceof HTMLElement && parent.classList.contains("CodeMirror-scroll")) {
          this.scrollParent = parent;
          break;
        }

        parent = parent.parentNode;
      }

      if (this.scrollParent) {
        this.scrollParent.addEventListener("scroll", this.repositionOnScroll);
        this.repositionOnScroll();
      }
    }
  }

  getDefaultValue() {
    const {
      breakpoint,
      log
    } = this.props;
    const options = (breakpoint === null || breakpoint === void 0 ? void 0 : breakpoint.options) || {};
    return log ? options.logValue : options.condition;
  }

  renderConditionalPanel(props) {
    const {
      log
    } = props;
    const defaultValue = this.getDefaultValue();
    const panel = document.createElement("div");

    _reactDom.default.render((0, _reactDomFactories.div)({
      className: classnames("conditional-breakpoint-panel", {
        "log-point": log
      }),
      onClick: () => this.keepFocusOnInput(),
      ref: node => this.panelNode = node
    }, (0, _reactDomFactories.div)({
      className: "prompt"
    }, "»"), (0, _reactDomFactories.textarea)({
      defaultValue,
      ref: input => this.createEditor(input)
    })), panel);

    return panel;
  }

  render() {
    return null;
  }

}

exports.ConditionalPanel = ConditionalPanel;

const mapStateToProps = state => {
  const location = (0, _selectors.getConditionalPanelLocation)(state);

  if (!location) {
    throw new Error("Conditional panel location needed.");
  }

  const breakpoint = (0, _selectors.getClosestBreakpoint)(state, location);
  return {
    breakpoint,
    location,
    log: (0, _selectors.getLogPointStatus)(state)
  };
};

const {
  setBreakpointOptions,
  openConditionalPanel,
  closeConditionalPanel
} = _actions.default;
const mapDispatchToProps = {
  setBreakpointOptions,
  openConditionalPanel,
  closeConditionalPanel
};

var _default = (0, _connect.connect)(mapStateToProps, mapDispatchToProps)(ConditionalPanel);

exports.default = _default;