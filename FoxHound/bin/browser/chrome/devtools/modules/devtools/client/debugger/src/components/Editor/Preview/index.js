"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _Popup = _interopRequireDefault(require("./Popup"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _actions = _interopRequireDefault(require("../../../actions/index"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const EXCEPTION_MARKER = "mark-text-exception";

class Preview extends _react.PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "target", null);

    _defineProperty(this, "onTokenEnter", async ({
      target,
      tokenPos
    }) => {
      // Use a temporary object to uniquely identify the asynchronous processing of this user event
      // and bail out if we started hovering another token.
      const tokenId = {};
      this.currentTokenId = tokenId;
      const {
        editor,
        getPreview,
        getExceptionPreview
      } = this.props; // Ignore inline previews code widgets

      if (target.closest(".CodeMirror-widget")) {
        return;
      }

      const isTargetException = target.classList.contains(EXCEPTION_MARKER);
      let preview;

      if (isTargetException) {
        preview = await getExceptionPreview(target, tokenPos, editor.codeMirror);
      }

      if (!preview && this.props.isPaused && !this.state.selecting) {
        preview = await getPreview(target, tokenPos, editor.codeMirror);
      } // Prevent modifying state and showing this preview if we started hovering another token


      if (!preview || this.currentTokenId !== tokenId) {
        return;
      }

      this.setState({
        preview
      });
    });

    _defineProperty(this, "onMouseUp", () => {
      if (this.props.isPaused) {
        this.setState({
          selecting: false
        });
      }
    });

    _defineProperty(this, "onMouseDown", () => {
      if (this.props.isPaused) {
        this.setState({
          selecting: true
        });
      }
    });

    _defineProperty(this, "onScroll", () => {
      if (this.props.isPaused) {
        this.clearPreview();
      }
    });

    _defineProperty(this, "clearPreview", () => {
      this.setState({
        preview: null
      });
    });

    this.state = {
      selecting: false
    };
  }

  static get propTypes() {
    return {
      editor: _propTypes.default.object.isRequired,
      editorRef: _propTypes.default.object.isRequired,
      isPaused: _propTypes.default.bool.isRequired,
      getExceptionPreview: _propTypes.default.func.isRequired,
      getPreview: _propTypes.default.func
    };
  }

  componentDidMount() {
    this.updateListeners();
  }

  componentWillUnmount() {
    const {
      codeMirror
    } = this.props.editor;
    const codeMirrorWrapper = codeMirror.getWrapperElement();
    codeMirror.off("tokenenter", this.onTokenEnter);
    codeMirror.off("scroll", this.onScroll);
    codeMirrorWrapper.removeEventListener("mouseup", this.onMouseUp);
    codeMirrorWrapper.removeEventListener("mousedown", this.onMouseDown);
  }

  updateListeners(prevProps) {
    const {
      codeMirror
    } = this.props.editor;
    const codeMirrorWrapper = codeMirror.getWrapperElement();
    codeMirror.on("tokenenter", this.onTokenEnter);
    codeMirror.on("scroll", this.onScroll);
    codeMirrorWrapper.addEventListener("mouseup", this.onMouseUp);
    codeMirrorWrapper.addEventListener("mousedown", this.onMouseDown);
  } // Note that these events are emitted by utils/editor/tokens.js


  render() {
    const {
      preview
    } = this.state;

    if (!preview || this.state.selecting) {
      return null;
    }

    return _react.default.createElement(_Popup.default, {
      preview: preview,
      editor: this.props.editor,
      editorRef: this.props.editorRef,
      clearPreview: this.clearPreview
    });
  }

}

const mapStateToProps = state => {
  return {
    isPaused: (0, _selectors.getIsCurrentThreadPaused)(state)
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  addExpression: _actions.default.addExpression,
  getPreview: _actions.default.getPreview,
  getExceptionPreview: _actions.default.getExceptionPreview
})(Preview);

exports.default = _default;