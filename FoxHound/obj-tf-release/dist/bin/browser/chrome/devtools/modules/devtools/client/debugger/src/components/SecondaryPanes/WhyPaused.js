"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

var _actions = _interopRequireDefault(require("../../actions/index"));

var _index = _interopRequireDefault(require("devtools/client/shared/components/reps/index"));

loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/utils/pause/index");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const {
  LocalizationProvider,
  Localized
} = require("devtools/client/shared/vendor/fluent-react");

const {
  REPS: {
    Rep
  },
  MODE
} = _index.default;

class WhyPaused extends _react.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hideWhyPaused: ""
    };
  }

  static get propTypes() {
    return {
      delay: _propTypes.default.number.isRequired,
      endPanelCollapsed: _propTypes.default.bool.isRequired,
      highlightDomElement: _propTypes.default.func.isRequired,
      openElementInInspector: _propTypes.default.func.isRequired,
      unHighlightDomElement: _propTypes.default.func.isRequired,
      why: _propTypes.default.object
    };
  }

  componentDidUpdate() {
    const {
      delay
    } = this.props;

    if (delay) {
      setTimeout(() => {
        this.setState({
          hideWhyPaused: ""
        });
      }, delay);
    } else {
      this.setState({
        hideWhyPaused: "pane why-paused"
      });
    }
  }

  renderExceptionSummary(exception) {
    if (typeof exception === "string") {
      return exception;
    }

    const {
      preview
    } = exception;

    if (!preview || !preview.name || !preview.message) {
      return null;
    }

    return `${preview.name}: ${preview.message}`;
  }

  renderMessage(why) {
    const {
      type,
      exception,
      message
    } = why;

    if (type == "exception" && exception) {
      // Our types for 'Why' are too general because 'type' can be 'string'.
      // $FlowFixMe - We should have a proper discriminating union of reasons.
      const summary = this.renderExceptionSummary(exception);
      return (0, _reactDomFactories.div)({
        className: "message warning"
      }, summary);
    }

    if (type === "mutationBreakpoint" && why.nodeGrip) {
      const {
        nodeGrip,
        ancestorGrip,
        action
      } = why;
      const {
        openElementInInspector,
        highlightDomElement,
        unHighlightDomElement
      } = this.props;
      const targetRep = Rep({
        object: nodeGrip,
        mode: MODE.TINY,
        onDOMNodeClick: () => openElementInInspector(nodeGrip),
        onInspectIconClick: () => openElementInInspector(nodeGrip),
        onDOMNodeMouseOver: () => highlightDomElement(nodeGrip),
        onDOMNodeMouseOut: () => unHighlightDomElement()
      });
      const ancestorRep = ancestorGrip ? Rep({
        object: ancestorGrip,
        mode: MODE.TINY,
        onDOMNodeClick: () => openElementInInspector(ancestorGrip),
        onInspectIconClick: () => openElementInInspector(ancestorGrip),
        onDOMNodeMouseOver: () => highlightDomElement(ancestorGrip),
        onDOMNodeMouseOut: () => unHighlightDomElement()
      }) : null;
      return (0, _reactDomFactories.div)(null, (0, _reactDomFactories.div)({
        className: "message"
      }, why.message), (0, _reactDomFactories.div)({
        className: "mutationNode"
      }, ancestorRep, ancestorGrip ? (0, _reactDomFactories.span)({
        className: "why-paused-ancestor"
      }, _react.default.createElement(Localized, {
        id: action === "remove" ? "whypaused-mutation-breakpoint-removed" : "whypaused-mutation-breakpoint-added"
      }), targetRep) : targetRep));
    }

    if (typeof message == "string") {
      return (0, _reactDomFactories.div)({
        className: "message"
      }, message);
    }

    return null;
  }

  render() {
    const {
      endPanelCollapsed,
      why
    } = this.props;
    const {
      fluentBundles
    } = this.context;
    const reason = (0, _pause.getPauseReason)(why);

    if (!why || !reason || endPanelCollapsed) {
      return (0, _reactDomFactories.div)({
        className: this.state.hideWhyPaused
      });
    }

    return (// We're rendering the LocalizationProvider component from here and not in an upper
      // component because it does set a new context, overriding the context that we set
      // in the first place in <App>, which breaks some components.
      // This should be fixed in Bug 1743155.
      _react.default.createElement(LocalizationProvider, {
        bundles: fluentBundles || []
      }, (0, _reactDomFactories.div)({
        className: "pane why-paused"
      }, (0, _reactDomFactories.div)(null, (0, _reactDomFactories.div)({
        className: "info icon"
      }, _react.default.createElement(_AccessibleImage.default, {
        className: "info"
      })), (0, _reactDomFactories.div)({
        className: "pause reason"
      }, _react.default.createElement(Localized, {
        id: reason
      }), this.renderMessage(why)))))
    );
  }

}

WhyPaused.contextTypes = {
  fluentBundles: _propTypes.default.array
};

const mapStateToProps = state => ({
  endPanelCollapsed: (0, _selectors.getPaneCollapse)(state, "end"),
  why: (0, _selectors.getPauseReason)(state, (0, _selectors.getCurrentThread)(state))
});

var _default = (0, _connect.connect)(mapStateToProps, {
  openElementInInspector: _actions.default.openElementInInspectorCommand,
  highlightDomElement: _actions.default.highlightDomElement,
  unHighlightDomElement: _actions.default.unHighlightDomElement
})(WhyPaused);

exports.default = _default;