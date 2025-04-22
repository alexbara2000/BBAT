"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Thread = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

class Thread extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onSelectThread", () => {
      this.props.selectThread(this.props.thread.actor);
    });
  }

  static get propTypes() {
    return {
      currentThread: _propTypes.default.string.isRequired,
      isPaused: _propTypes.default.bool.isRequired,
      selectThread: _propTypes.default.func.isRequired,
      thread: _propTypes.default.object.isRequired
    };
  }

  render() {
    const {
      currentThread,
      isPaused,
      thread
    } = this.props;
    const isWorker = thread.targetType.includes("worker");
    let label = thread.name;

    if (thread.serviceWorkerStatus) {
      label += ` (${thread.serviceWorkerStatus})`;
    }

    return (0, _reactDomFactories.div)({
      className: classnames("thread", {
        selected: thread.actor == currentThread,
        paused: isPaused
      }),
      key: thread.actor,
      onClick: this.onSelectThread
    }, (0, _reactDomFactories.div)({
      className: "icon"
    }, _react.default.createElement(_AccessibleImage.default, {
      className: isWorker ? "worker" : "window"
    })), (0, _reactDomFactories.div)({
      className: "label"
    }, label), isPaused ? (0, _reactDomFactories.span)({
      className: "pause-badge",
      role: "status"
    }, L10N.getStr("pausedThread")) : null);
  }

}

exports.Thread = Thread;

const mapStateToProps = (state, props) => ({
  currentThread: (0, _selectors.getCurrentThread)(state),
  isPaused: (0, _selectors.getIsPaused)(state, props.thread.actor)
});

var _default = (0, _connect.connect)(mapStateToProps, {
  selectThread: _actions.default.selectThread
})(Thread);

exports.default = _default;