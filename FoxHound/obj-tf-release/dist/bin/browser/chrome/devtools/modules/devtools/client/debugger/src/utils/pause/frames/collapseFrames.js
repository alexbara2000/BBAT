"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collapseFrames = collapseFrames;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function collapseLastFrames(frames) {
  const index = frames.findIndex(frame => {
    var _frame$location$sourc;

    return (_frame$location$sourc = frame.location.source.url) === null || _frame$location$sourc === void 0 ? void 0 : _frame$location$sourc.match(/webpack\/bootstrap/i);
  });

  if (index == -1) {
    return {
      newFrames: frames,
      lastGroup: []
    };
  }

  const newFrames = frames.slice(0, index);
  const lastGroup = frames.slice(index);
  return {
    newFrames,
    lastGroup
  };
}

function collapseFrames(frames) {
  // We collapse groups of one so that user frames
  // are not in a group of one
  function addGroupToList(group, list) {
    if (!group) {
      return list;
    }

    if (group.length > 1) {
      list.push(group);
    } else {
      list = list.concat(group);
    }

    return list;
  }

  const {
    newFrames,
    lastGroup
  } = collapseLastFrames(frames);
  frames = newFrames;
  let items = [];
  let currentGroup = null;
  let prevItem = null;

  for (const frame of frames) {
    var _prevItem;

    const prevLibrary = (_prevItem = prevItem) === null || _prevItem === void 0 ? void 0 : _prevItem.library;

    if (!currentGroup) {
      currentGroup = [frame];
    } else if (prevLibrary && prevLibrary == frame.library) {
      currentGroup.push(frame);
    } else {
      items = addGroupToList(currentGroup, items);
      currentGroup = [frame];
    }

    prevItem = frame;
  }

  items = addGroupToList(currentGroup, items);
  items = addGroupToList(lastGroup, items);
  return items;
}