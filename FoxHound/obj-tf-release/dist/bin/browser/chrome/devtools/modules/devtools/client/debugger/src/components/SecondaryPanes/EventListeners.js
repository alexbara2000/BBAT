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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

class EventListeners extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      searchText: "",
      focused: false
    });

    _defineProperty(this, "onInputChange", event => {
      this.setState({
        searchText: event.currentTarget.value
      });
    });

    _defineProperty(this, "onKeyDown", event => {
      if (event.key === "Escape") {
        this.setState({
          searchText: ""
        });
      }
    });

    _defineProperty(this, "onFocus", event => {
      this.setState({
        focused: true
      });
    });

    _defineProperty(this, "onBlur", event => {
      this.setState({
        focused: false
      });
    });
  }

  static get propTypes() {
    return {
      activeEventListeners: _propTypes.default.array.isRequired,
      addEventListenerExpanded: _propTypes.default.func.isRequired,
      addEventListeners: _propTypes.default.func.isRequired,
      categories: _propTypes.default.array.isRequired,
      expandedCategories: _propTypes.default.array.isRequired,
      removeEventListenerExpanded: _propTypes.default.func.isRequired,
      removeEventListeners: _propTypes.default.func.isRequired
    };
  }

  hasMatch(eventOrCategoryName, searchText) {
    const lowercaseEventOrCategoryName = eventOrCategoryName.toLowerCase();
    const lowercaseSearchText = searchText.toLowerCase();
    return lowercaseEventOrCategoryName.includes(lowercaseSearchText);
  }

  getSearchResults() {
    const {
      searchText
    } = this.state;
    const {
      categories
    } = this.props;
    const searchResults = categories.reduce((results, cat, index) => {
      const category = categories[index];

      if (this.hasMatch(category.name, searchText)) {
        results[category.name] = category.events;
      } else {
        results[category.name] = category.events.filter(event => this.hasMatch(event.name, searchText));
      }

      return results;
    }, {});
    return searchResults;
  }

  onCategoryToggle(category) {
    const {
      expandedCategories,
      removeEventListenerExpanded,
      addEventListenerExpanded
    } = this.props;

    if (expandedCategories.includes(category)) {
      removeEventListenerExpanded(category);
    } else {
      addEventListenerExpanded(category);
    }
  }

  onCategoryClick(category, isChecked) {
    const {
      addEventListeners,
      removeEventListeners
    } = this.props;
    const eventsIds = category.events.map(event => event.id);

    if (isChecked) {
      addEventListeners(eventsIds);
    } else {
      removeEventListeners(eventsIds);
    }
  }

  onEventTypeClick(eventId, isChecked) {
    const {
      addEventListeners,
      removeEventListeners
    } = this.props;

    if (isChecked) {
      addEventListeners([eventId]);
    } else {
      removeEventListeners([eventId]);
    }
  }

  renderSearchInput() {
    const {
      focused,
      searchText
    } = this.state;
    const placeholder = L10N.getStr("eventListenersHeader1.placeholder");
    return (0, _reactDomFactories.form)({
      className: "event-search-form",
      onSubmit: e => e.preventDefault()
    }, (0, _reactDomFactories.input)({
      className: classnames("event-search-input", {
        focused
      }),
      placeholder: placeholder,
      value: searchText,
      onChange: this.onInputChange,
      onKeyDown: this.onKeyDown,
      onFocus: this.onFocus,
      onBlur: this.onBlur
    }));
  }

  renderClearSearchButton() {
    const {
      searchText
    } = this.state;

    if (!searchText) {
      return null;
    }

    return (0, _reactDomFactories.button)({
      onClick: () => this.setState({
        searchText: ""
      }),
      className: "devtools-searchinput-clear"
    });
  }

  renderCategoriesList() {
    const {
      categories
    } = this.props;
    return (0, _reactDomFactories.ul)({
      className: "event-listeners-list"
    }, categories.map((category, index) => {
      return (0, _reactDomFactories.li)({
        className: "event-listener-group",
        key: index
      }, this.renderCategoryHeading(category), this.renderCategoryListing(category));
    }));
  }

  renderSearchResultsList() {
    const searchResults = this.getSearchResults();
    return (0, _reactDomFactories.ul)({
      className: "event-search-results-list"
    }, Object.keys(searchResults).map(category => {
      return searchResults[category].map(event => {
        return this.renderListenerEvent(event, category);
      });
    }));
  }

  renderCategoryHeading(category) {
    const {
      activeEventListeners,
      expandedCategories
    } = this.props;
    const {
      events
    } = category;
    const expanded = expandedCategories.includes(category.name);
    const checked = events.every(({
      id
    }) => activeEventListeners.includes(id));
    const indeterminate = !checked && events.some(({
      id
    }) => activeEventListeners.includes(id));
    return (0, _reactDomFactories.div)({
      className: "event-listener-header"
    }, (0, _reactDomFactories.button)({
      className: "event-listener-expand",
      onClick: () => this.onCategoryToggle(category.name)
    }, _react.default.createElement(_AccessibleImage.default, {
      className: classnames("arrow", {
        expanded
      })
    })), (0, _reactDomFactories.label)({
      className: "event-listener-label"
    }, (0, _reactDomFactories.input)({
      type: "checkbox",
      value: category.name,
      onChange: e => {
        this.onCategoryClick(category, // Clicking an indeterminate checkbox should always have the
        // effect of disabling any selected items.
        indeterminate ? false : e.target.checked);
      },
      checked: checked,
      ref: el => el && (el.indeterminate = indeterminate)
    }), (0, _reactDomFactories.span)({
      className: "event-listener-category"
    }, category.name)));
  }

  renderCategoryListing(category) {
    const {
      expandedCategories
    } = this.props;
    const expanded = expandedCategories.includes(category.name);

    if (!expanded) {
      return null;
    }

    return (0, _reactDomFactories.ul)(null, category.events.map(event => {
      return this.renderListenerEvent(event, category.name);
    }));
  }

  renderCategory(category) {
    return (0, _reactDomFactories.span)({
      className: "category-label"
    }, category, " \u25B8 ");
  }

  renderListenerEvent(event, category) {
    const {
      activeEventListeners
    } = this.props;
    const {
      searchText
    } = this.state;
    return (0, _reactDomFactories.li)({
      className: "event-listener-event",
      key: event.id
    }, (0, _reactDomFactories.label)({
      className: "event-listener-label"
    }, (0, _reactDomFactories.input)({
      type: "checkbox",
      value: event.id,
      onChange: e => this.onEventTypeClick(event.id, e.target.checked),
      checked: activeEventListeners.includes(event.id)
    }), (0, _reactDomFactories.span)({
      className: "event-listener-name"
    }, searchText ? this.renderCategory(category) : null, event.name)));
  }

  render() {
    const {
      searchText
    } = this.state;
    return (0, _reactDomFactories.div)({
      className: "event-listeners"
    }, (0, _reactDomFactories.div)({
      className: "event-search-container"
    }, this.renderSearchInput(), this.renderClearSearchButton()), (0, _reactDomFactories.div)({
      className: "event-listeners-content"
    }, searchText ? this.renderSearchResultsList() : this.renderCategoriesList()));
  }

}

const mapStateToProps = state => ({
  activeEventListeners: (0, _selectors.getActiveEventListeners)(state),
  categories: (0, _selectors.getEventListenerBreakpointTypes)(state),
  expandedCategories: (0, _selectors.getEventListenerExpanded)(state)
});

var _default = (0, _connect.connect)(mapStateToProps, {
  addEventListeners: _actions.default.addEventListenerBreakpoints,
  removeEventListeners: _actions.default.removeEventListenerBreakpoints,
  addEventListenerExpanded: _actions.default.addEventListenerExpanded,
  removeEventListenerExpanded: _actions.default.removeEventListenerExpanded
})(EventListeners);

exports.default = _default;