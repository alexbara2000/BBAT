"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/utils/ui");
loader.lazyRequireGetter(this, "_tabs", "devtools/client/debugger/src/utils/tabs");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

var _actions = _interopRequireDefault(require("../../actions/index"));

var _Tab = _interopRequireDefault(require("./Tab"));

loader.lazyRequireGetter(this, "_Button", "devtools/client/debugger/src/components/shared/Button/index");

var _Dropdown = _interopRequireDefault(require("../shared/Dropdown"));

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

var _CommandBar = _interopRequireDefault(require("../SecondaryPanes/CommandBar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  debounce
} = require("devtools/shared/debounce");

function haveTabSourcesChanged(tabSources, prevTabSources) {
  if (tabSources.length !== prevTabSources.length) {
    return true;
  }

  for (let i = 0; i < tabSources.length; ++i) {
    if (tabSources[i].id !== prevTabSources[i].id) {
      return true;
    }
  }

  return false;
}

class Tabs extends _react.PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "updateHiddenTabs", () => {
      if (!this.refs.sourceTabs) {
        return;
      }

      const {
        selectedSource,
        tabSources,
        moveTab
      } = this.props;
      const sourceTabEls = this.refs.sourceTabs.children;
      const hiddenTabs = (0, _tabs.getHiddenTabs)(tabSources, sourceTabEls);

      if (selectedSource && (0, _ui.isVisible)() && hiddenTabs.find(tab => tab.id == selectedSource.id)) {
        moveTab(selectedSource.url, 0);
        return;
      }

      this.setState({
        hiddenTabs
      });
    });

    _defineProperty(this, "renderDropdownSource", source => {
      const {
        selectSource
      } = this.props;
      const filename = (0, _source.getFilename)(source);

      const onClick = () => selectSource(source);

      return (0, _reactDomFactories.li)({
        key: source.id,
        onClick: onClick,
        title: (0, _source.getFileURL)(source, false)
      }, _react.default.createElement(_AccessibleImage.default, {
        className: `dropdown-icon ${this.getIconClass(source)}`
      }), (0, _reactDomFactories.span)({
        className: "dropdown-label"
      }, filename));
    });

    _defineProperty(this, "onTabDragStart", e => {
      this.draggedSourceId = e.target.dataset.sourceId;
      this.draggedSourceIndex = e.target.dataset.index;
    });

    _defineProperty(this, "onTabDragEnd", () => {
      this.draggedSourceId = null;
      this.draggedSourceIndex = -1;
    });

    _defineProperty(this, "onTabDragOver", e => {
      e.preventDefault();
      const hoveredTabIndex = e.target.dataset.index;
      const {
        moveTabBySourceId
      } = this.props;

      if (hoveredTabIndex === this.draggedSourceIndex) {
        return;
      }

      const tabDOMRect = e.target.getBoundingClientRect();
      const {
        pageX: mouseCursorX
      } = e;

      if (
      /* Case: the mouse cursor moves into the left half of any target tab */
      mouseCursorX - tabDOMRect.left < tabDOMRect.width / 2) {
        // The current tab goes to the left of the target tab
        const targetTab = hoveredTabIndex > this.draggedSourceIndex ? hoveredTabIndex - 1 : hoveredTabIndex;
        moveTabBySourceId(this.draggedSourceId, targetTab);
        this.draggedSourceIndex = targetTab;
      } else if (
      /* Case: the mouse cursor moves into the right half of any target tab */
      mouseCursorX - tabDOMRect.left >= tabDOMRect.width / 2) {
        // The current tab goes to the right of the target tab
        const targetTab = hoveredTabIndex < this.draggedSourceIndex ? hoveredTabIndex + 1 : hoveredTabIndex;
        moveTabBySourceId(this.draggedSourceId, targetTab);
        this.draggedSourceIndex = targetTab;
      }
    });

    this.state = {
      dropdownShown: false,
      hiddenTabs: []
    };
    this.onResize = debounce(() => {
      this.updateHiddenTabs();
    });
  }

  static get propTypes() {
    return {
      endPanelCollapsed: _propTypes.default.bool.isRequired,
      horizontal: _propTypes.default.bool.isRequired,
      isPaused: _propTypes.default.bool.isRequired,
      moveTab: _propTypes.default.func.isRequired,
      moveTabBySourceId: _propTypes.default.func.isRequired,
      selectSource: _propTypes.default.func.isRequired,
      selectedSource: _propTypes.default.object,
      blackBoxRanges: _propTypes.default.object.isRequired,
      startPanelCollapsed: _propTypes.default.bool.isRequired,
      tabSources: _propTypes.default.array.isRequired,
      tabs: _propTypes.default.array.isRequired,
      togglePaneCollapse: _propTypes.default.func.isRequired
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSource !== prevProps.selectedSource || haveTabSourcesChanged(this.props.tabSources, prevProps.tabSources)) {
      this.updateHiddenTabs();
    }
  }

  componentDidMount() {
    window.requestIdleCallback(this.updateHiddenTabs);
    window.addEventListener("resize", this.onResize);
    window.document.querySelector(".editor-pane").addEventListener("resizeend", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    window.document.querySelector(".editor-pane").removeEventListener("resizeend", this.onResize);
  }
  /*
   * Updates the hiddenSourceTabs state, by
   * finding the source tabs which are wrapped and are not on the top row.
   */


  toggleSourcesDropdown() {
    this.setState(prevState => ({
      dropdownShown: !prevState.dropdownShown
    }));
  }

  getIconClass(source) {
    if ((0, _source.isPretty)(source)) {
      return "prettyPrint";
    }

    if (this.props.blackBoxRanges[source.url]) {
      return "blackBox";
    }

    return "file";
  }

  renderTabs() {
    const {
      tabs
    } = this.props;

    if (!tabs) {
      return null;
    }

    return (0, _reactDomFactories.div)({
      className: "source-tabs",
      ref: "sourceTabs"
    }, tabs.map(({
      source,
      sourceActor
    }, index) => {
      return _react.default.createElement(_Tab.default, {
        onDragStart: this.onTabDragStart,
        onDragOver: this.onTabDragOver,
        onDragEnd: this.onTabDragEnd,
        key: source.id + (sourceActor === null || sourceActor === void 0 ? void 0 : sourceActor.id),
        index,
        source,
        sourceActor
      });
    }));
  }

  renderDropdown() {
    const {
      hiddenTabs
    } = this.state;

    if (!hiddenTabs || !hiddenTabs.length) {
      return null;
    }

    const panel = (0, _reactDomFactories.ul)(null, hiddenTabs.map(this.renderDropdownSource));

    const icon = _react.default.createElement(_AccessibleImage.default, {
      className: "more-tabs"
    });

    return _react.default.createElement(_Dropdown.default, {
      panel,
      icon
    });
  }

  renderCommandBar() {
    const {
      horizontal,
      endPanelCollapsed,
      isPaused
    } = this.props;

    if (!endPanelCollapsed || !isPaused) {
      return null;
    }

    return _react.default.createElement(_CommandBar.default, {
      horizontal
    });
  }

  renderStartPanelToggleButton() {
    return _react.default.createElement(_Button.PaneToggleButton, {
      position: "start",
      collapsed: this.props.startPanelCollapsed,
      handleClick: this.props.togglePaneCollapse
    });
  }

  renderEndPanelToggleButton() {
    const {
      horizontal,
      endPanelCollapsed,
      togglePaneCollapse
    } = this.props;

    if (!horizontal) {
      return null;
    }

    return _react.default.createElement(_Button.PaneToggleButton, {
      position: "end",
      collapsed: endPanelCollapsed,
      handleClick: togglePaneCollapse,
      horizontal
    });
  }

  render() {
    return (0, _reactDomFactories.div)({
      className: "source-header"
    }, this.renderStartPanelToggleButton(), this.renderTabs(), this.renderDropdown(), this.renderEndPanelToggleButton(), this.renderCommandBar());
  }

}

const mapStateToProps = state => {
  return {
    selectedSource: (0, _selectors.getSelectedSource)(state),
    tabSources: (0, _selectors.getSourcesForTabs)(state),
    tabs: (0, _selectors.getSourceTabs)(state),
    blackBoxRanges: (0, _selectors.getBlackBoxRanges)(state),
    isPaused: (0, _selectors.getIsPaused)(state, (0, _selectors.getCurrentThread)(state))
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  selectSource: _actions.default.selectSource,
  moveTab: _actions.default.moveTab,
  moveTabBySourceId: _actions.default.moveTabBySourceId,
  closeTab: _actions.default.closeTab,
  togglePaneCollapse: _actions.default.togglePaneCollapse,
  showSource: _actions.default.showSource
})(Tabs);

exports.default = _default;