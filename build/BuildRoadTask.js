module.exports = (function () {
  'use strict';

  var Task = require('Task');
  var utils = require('utils');
  var Look = require('Look');

  function BuildRoadTask() {
    BuildRoadTask.__super__.constructor.call(this, 'buildRoad', 20);
  }

  BuildRoadTask.__super__ = Task.prototype;
  BuildRoadTask.prototype = Object.create(BuildRoadTask.__super__);
  BuildRoadTask.prototype.constructor = BuildRoadTask;

  function collectionContainsSiteOfSiteType(sites, type) {
    var index = -1;
    while (++index < sites.length) {
      if (sites[index].structureType === type) {
        return true;
      }
    }
    return false;
  }

  BuildRoadTask.prototype.doTask = function doTask() {
    var
      spawns = utils.valuesOf(Game.spawns),
      index = -1, spawn;
    while (++index < spawns.length) {
      spawn = spawns[index];
      if (!collectionContainsSiteOfSiteType(spawn.room.find(Game.CONSTRUCTION_SITES), Game.STRUCTURE_ROAD)) {
        if (this.buildRoadToCollectionOfStructures(spawn, spawns)) {
          // build road between 2 spawns
          return;
        }
        if (this.buildRoadToCollectionOfStructures(spawn, spawn.room.find(Game.SOURCES))) {
          // build road between spawns-source
          return;
        }
      }
    }
  };

  BuildRoadTask.prototype.buildRoadTo = function (from, to) {
    var room = Game.rooms[from.pos.roomName], isBuilding = false;
    if (room !== Game.rooms[to.pos.roomName)] {
      return false;
    }
    var path = from.pos.findPathTo(to, { ignoreCreeps: true, ignoreDestructibleStructures: true, maxOps: 200 });
    path.forEach(function (pos) {
      if (room.createConstructionSite(pos, Game.STRUCTURE_ROAD) === Game.OK) isBuilding = true;
    });
    return isBuilding;
  };

  BuildRoadTask.prototype.buildRoadToCollectionOfStructures = function (from, destinationArray) {
    var index = -1, destination;
    while (++index < destinationArray.length) {
      destination = destinationArray[index];
      if (destination !== from) {
        if (this.buildRoadTo(from, destination)) {
          // if road is build, return true
          return true;
        }
      }
    }
    return false;
  };

  return BuildRoadTask;

})();