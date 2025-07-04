"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _actions = _interopRequireDefault(require("../../../actions/index"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _SourceIcon = _interopRequireDefault(require("../../shared/SourceIcon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BreakpointHeading extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onContextMenu", event => {
      event.preventDefault();
      this.props.showBreakpointHeadingContextMenu(event, this.props.source);
    });
  }

  static get propTypes() {
    return {
      sources: _propTypes.default.array.isRequired,
      source: _propTypes.default.object.isRequired,
      firstSourceActor: _propTypes.default.object,
      selectSource: _propTypes.default.func.isRequired,
      showBreakpointHeadingContextMenu: _propTypes.default.func.isRequired
    };
  }

  render() {
    const {
      sources,
      source,
      selectSource
    } = this.props;
    const path = (0, _source.getDisplayPath)(source, sources);
    const query = (0, _source.getSourceQueryString)(source);
    return (0, _reactDomFactories.div)({
      className: "breakpoint-heading",
      title: (0, _source.getFileURL)(source, false),
      onClick: () => selectSource(source),
      onContextMenu: this.onContextMenu
    }, _react.default.createElement(_SourceIcon.default, // Breakpoints are displayed per source and may relate to many source actors.
    // Arbitrarily pick the first source actor to compute the matching source icon
    // The source actor is used to pick one specific source text content and guess
    // the related framework icon.
    {
      location: (0, _location.createLocation)({
        source,
        sourceActor: this.props.firstSourceActor
      }),
      modifier: icon => ["file", "javascript"].includes(icon) ? null : icon
    }), (0, _reactDomFactories.div)({
      className: "filename"
    }, (0, _source.getTruncatedFileName)(source, query), path && (0, _reactDomFactories.span)(null, `../${path}/..`)));
  }

}

const mapStateToProps = (state, {
  source
}) => ({
  firstSourceActor: (0, _selectors.getFirstSourceActorForGeneratedSource)(state, source.id)
});

var _default = (0, _connect.connect)(mapStateToProps, {
  selectSource: _actions.default.selectSource,
  showBreakpointHeadingContextMenu: _actions.default.showBreakpointHeadingContextMenu
})(BreakpointHeading);

exports.default = _default;