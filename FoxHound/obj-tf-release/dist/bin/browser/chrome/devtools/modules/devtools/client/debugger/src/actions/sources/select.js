"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectSourceURL = selectSourceURL;
exports.selectSource = selectSource;
exports.selectLocation = selectLocation;
exports.selectSpecificLocation = selectSpecificLocation;
exports.selectSpecificLocationOrSameUrl = selectSpecificLocationOrSameUrl;
exports.jumpToMappedLocation = jumpToMappedLocation;
exports.jumpToMappedSelectedLocation = jumpToMappedSelectedLocation;
exports.clearSelectedLocation = exports.setPendingSelectedLocation = exports.setSelectedLocation = void 0;
loader.lazyRequireGetter(this, "_symbols", "devtools/client/debugger/src/actions/sources/symbols");
loader.lazyRequireGetter(this, "_ast", "devtools/client/debugger/src/actions/ast/index");
loader.lazyRequireGetter(this, "_prettyPrint", "devtools/client/debugger/src/actions/sources/prettyPrint");
loader.lazyRequireGetter(this, "_tabs", "devtools/client/debugger/src/actions/tabs");
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_sourceMaps", "devtools/client/debugger/src/utils/source-maps");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Redux actions for the sources state
 * @module actions/sources
 */
// This is only used by jest tests (and within this module)
const setSelectedLocation = (location, shouldSelectOriginalLocation) => ({
  type: "SET_SELECTED_LOCATION",
  location,
  shouldSelectOriginalLocation
}); // This is only used by jest tests (and within this module)


exports.setSelectedLocation = setSelectedLocation;

const setPendingSelectedLocation = (url, options) => ({
  type: "SET_PENDING_SELECTED_LOCATION",
  url,
  line: options === null || options === void 0 ? void 0 : options.line,
  column: options === null || options === void 0 ? void 0 : options.column
}); // This is only used by jest tests (and within this module)


exports.setPendingSelectedLocation = setPendingSelectedLocation;

const clearSelectedLocation = () => ({
  type: "CLEAR_SELECTED_LOCATION"
});
/**
 * Deterministically select a source that has a given URL. This will
 * work regardless of the connection status or if the source exists
 * yet.
 *
 * This exists mostly for external things to interact with the
 * debugger.
 */


exports.clearSelectedLocation = clearSelectedLocation;

function selectSourceURL(url, options) {
  return async ({
    dispatch,
    getState
  }) => {
    const source = (0, _selectors.getSourceByURL)(getState(), url);

    if (!source) {
      return dispatch(setPendingSelectedLocation(url, options));
    }

    const location = (0, _location.createLocation)({ ...options,
      source
    });
    return dispatch(selectLocation(location));
  };
}
/**
 * Wrapper around selectLocation, which creates the location object for us.
 * Note that it ignores the currently selected source and will select
 * the precise generated/original source passed as argument.
 *
 * @param {String} source
 *        The precise source to select.
 * @param {String} sourceActor
 *        The specific source actor of the source to
 *        select the source text. This is optional.
 */


function selectSource(source, sourceActor) {
  return async ({
    dispatch
  }) => {
    // `createLocation` requires a source object, but we may use selectSource to close the last tab,
    // where source will be null and the location will be an empty object.
    const location = source ? (0, _location.createLocation)({
      source,
      sourceActor
    }) : {};
    return dispatch(selectSpecificLocation(location));
  };
}
/**
 * Select a new location.
 * This will automatically select the source in the source tree (if visible)
 * and open the source (a new tab and the source editor)
 * as well as highlight a precise line in the editor.
 *
 * Note that by default, this may map your passed location to the original
 * or generated location based on the selected source state. (see keepContext)
 *
 * @param {Object} location
 * @param {Object} options
 * @param {boolean} options.keepContext
 *        If false, this will ignore the currently selected source
 *        and select the generated or original location, even if we
 *        were currently selecting the other source type.
 */


function selectLocation(location, {
  keepContext = true
} = {}) {
  return async thunkArgs => {
    const {
      dispatch,
      getState,
      client
    } = thunkArgs;

    if (!client) {
      // No connection, do nothing. This happens when the debugger is
      // shut down too fast and it tries to display a default source.
      return;
    }

    let source = location.source;

    if (!source) {
      // If there is no source we deselect the current selected source
      dispatch(clearSelectedLocation());
      return;
    } // Preserve the current source map context (original / generated)
    // when navigating to a new location.
    // i.e. if keepContext isn't manually overriden to false,
    // we will convert the source we want to select to either
    // original/generated in order to match the currently selected one.
    // If the currently selected source is original, we will
    // automatically map `location` to refer to the original source,
    // even if that used to refer only to the generated source.


    let shouldSelectOriginalLocation = (0, _selectors.getShouldSelectOriginalLocation)(getState());

    if (keepContext) {
      // Pretty print source may not be registered yet and getRelatedMapLocation may not return it.
      // Wait for the pretty print source to be fully processed.
      if (!location.source.isOriginal && shouldSelectOriginalLocation && (0, _selectors.hasPrettyTab)(getState(), location.source)) {
        // Note that prettyPrintAndSelectSource has already been called a bit before when this generated source has been added
        // but it is a slow operation and is most likely not resolved yet.
        // prettyPrintAndSelectSource uses memoization to avoid doing the operation more than once, while waiting from both callsites.
        await dispatch((0, _prettyPrint.prettyPrintAndSelectSource)(location.source));
      }

      if (shouldSelectOriginalLocation != location.source.isOriginal) {
        // getRelatedMapLocation will convert to the related generated/original location.
        // i.e if the original location is passed, the related generated location will be returned and vice versa.
        location = await (0, _sourceMaps.getRelatedMapLocation)(location, thunkArgs); // Note that getRelatedMapLocation may return the exact same location.
        // For example, if the source-map is half broken, it may return a generated location
        // while we were selecting original locations. So we may be seeing bundles intermittently
        // when stepping through broken source maps. And we will see original sources when stepping
        // through functional original sources.

        source = location.source;
      }
    } else {
      shouldSelectOriginalLocation = location.source.isOriginal;
    }

    let sourceActor = location.sourceActor;

    if (!sourceActor) {
      sourceActor = (0, _selectors.getFirstSourceActorForGeneratedSource)(getState(), source.id);
      location = (0, _location.createLocation)({ ...location,
        sourceActor
      });
    }

    if (!(0, _selectors.tabExists)(getState(), source.id)) {
      dispatch((0, _tabs.addTab)(source, sourceActor));
    }

    dispatch(setSelectedLocation(location, shouldSelectOriginalLocation));
    await dispatch((0, _loadSourceText.loadSourceText)(source, sourceActor));
    await dispatch((0, _.setBreakableLines)(location));
    const loadedSource = (0, _selectors.getSource)(getState(), source.id);

    if (!loadedSource) {
      // If there was a navigation while we were loading the loadedSource
      return;
    }

    const sourceTextContent = (0, _selectors.getSourceTextContent)(getState(), location);

    if (keepContext && _prefs.prefs.autoPrettyPrint && !(0, _selectors.getPrettySource)(getState(), loadedSource.id) && (0, _selectors.canPrettyPrintSource)(getState(), location) && (0, _source.isMinified)(source, sourceTextContent)) {
      await dispatch((0, _prettyPrint.prettyPrintAndSelectSource)(loadedSource));
      dispatch((0, _tabs.closeTab)(loadedSource));
    }

    await dispatch((0, _symbols.setSymbols)(location)); // /!\ we don't historicaly wait for this async action

    dispatch((0, _ast.setInScopeLines)());
  };
}
/**
 * Select a location while ignoring the currently selected source.
 * This will select the generated location even if the currently
 * select source is an original source. And the other way around.
 *
 * @param {Object} location
 *        The location to select, object which includes enough
 *        information to specify a precise source, line and column.
 */


function selectSpecificLocation(location) {
  return selectLocation(location, {
    keepContext: false
  });
}
/**
 * Similar to `selectSpecificLocation`, but if the precise Source object
 * is missing, this will fallback to select any source having the same URL.
 * In this fallback scenario, sources without a URL will be ignored.
 *
 * This is typically used when trying to select a source (e.g. in project search result)
 * after reload, because the source objects are new on each new page load, but source
 * with the same URL may still exist.
 *
 * @param {Object} location
 *        The location to select.
 * @return {function}
 *        The action will return true if a matching source was found.
 */


function selectSpecificLocationOrSameUrl(location) {
  return async ({
    dispatch,
    getState
  }) => {
    // If this particular source no longer exists, open any matching URL.
    // This will typically happen on reload.
    if (!(0, _selectors.hasSource)(getState(), location.source.id)) {
      // Some sources, like evaled script won't have a URL attribute
      // and can't be re-selected if we don't find the exact same source object.
      if (!location.source.url) {
        return false;
      }

      const source = (0, _selectors.getSourceByURL)(getState(), location.source.url);

      if (!source) {
        return false;
      } // Also reset the sourceActor, as it won't match the same source.


      const sourceActor = (0, _selectors.getFirstSourceActorForGeneratedSource)(getState(), location.source.id);
      location = (0, _location.createLocation)({ ...location,
        source,
        sourceActor
      });
    } else if (!(0, _selectors.hasSourceActor)(getState(), location.sourceActor.id)) {
      // If the specific source actor no longer exists, match any still available.
      const sourceActor = (0, _selectors.getFirstSourceActorForGeneratedSource)(getState(), location.source.id);
      location = (0, _location.createLocation)({ ...location,
        sourceActor
      });
    }

    await dispatch(selectSpecificLocation(location));
    return true;
  };
}
/**
 * Select the "mapped location".
 *
 * If the passed location is on a generated source, select the
 * related location in the original source.
 * If the passed location is on an original source, select the
 * related location in the generated source.
 */


function jumpToMappedLocation(location) {
  return async function (thunkArgs) {
    const {
      client,
      dispatch
    } = thunkArgs;

    if (!client) {
      return null;
    } // Map to either an original or a generated source location


    const pairedLocation = await (0, _sourceMaps.getRelatedMapLocation)(location, thunkArgs);
    return dispatch(selectSpecificLocation(pairedLocation));
  };
} // This is only used by tests


function jumpToMappedSelectedLocation() {
  return async function ({
    dispatch,
    getState
  }) {
    const location = (0, _selectors.getSelectedLocation)(getState());

    if (!location) {
      return;
    }

    await dispatch(jumpToMappedLocation(location));
  };
}