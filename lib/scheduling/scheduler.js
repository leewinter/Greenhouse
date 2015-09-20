(function(scheduler) {
  'use strict';

  var nodeScheduler = require('node-schedule'),
    pinDb = require('../db/pinDb.js'),
    ioLibrary = require('./ioLibrary.js');

  // Used to store all jobs prior to board initialisation
  var jobAgenda = [];
  var pinConfig = [];

  scheduler.init = function*() {
    jobAgenda = [];
    console.log('scheduler init called');
    // call this event when node first starts?
    // would allow us to turn anything on that should already be
    // running

    // Need to get all micro controllers
    var allControllers = yield pinDb.getAllPins();
    for (var i = 0; i < allControllers.length; i++) {
      yield scheduler.refreshJobs(allControllers[i]);
    }

    // Once all jobs have been registered lets call the agenda
    try {
      ioLibrary.init(pinConfig);
      for (var i = 0; i < jobAgenda.length; i++) {
        jobAgenda[i]();
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Job can be setup with the folowing details
  // year, month, date, dayOfWeek, hour, minute, second
  // function(jobName, {hour: h, minute: m}, scheduledFunction)
  scheduler.createJob = function(jobName, spec, callback) {
    try {
      var j = nodeScheduler.scheduleJob(jobName, spec, callback);
      return j;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  scheduler.cancelJob = function(jobName) {
    console.log('Removing job ', jobName);
    var currentJob = nodeScheduler.scheduledJobs[jobName];
    if (currentJob) {
      // Cancel and don't reschedule
      currentJob.cancelNext(false);
      return true;
    }
    return false;
  };

  scheduler.refreshJobs = function*(microController) {
    try {
      console.log('refreshJobs called for ', microController.microController);
      for (var i = 0; i < microController.pins.length; i++) {
        yield scheduler.refreshJobsForPin(microController.microController, microController.pins[i]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  scheduler.refreshJobsForPin = function*(microController, pin) {
    try {
      // Clear current jobs for this pin + microController
      var currentSchedulerJobs = scheduler.listJobsByName();
      for (var i = 0; i < currentSchedulerJobs.length; i++) {
        // Check if job name starts with our microController name + pin
        if (currentSchedulerJobs[i].name.indexOf(microController + '-' + pin.pin) === 0) {
          // kill it
          scheduler.cancelJob(currentSchedulerJobs[i].name);
        }
      }

      var events = pin.currentEvents;
      if (events && events.length > 0) {
        scheduler.registerEventsInOrder(microController, pin, events);
      }

    } catch (e) {
      console.log(e);
    }
  };

  scheduler.listJobsByName = function() {
    var myArray = [];
    for (var property in nodeScheduler.scheduledJobs) {
      if (nodeScheduler.scheduledJobs.hasOwnProperty(property)) {
        myArray.push({
          name: property,
          job: nodeScheduler.scheduledJobs[property]
        });
      }
    }
    return myArray;
  };

  scheduler.registerEventsInOrder = function(microController, pin, events) {
    var sortedEvents = events.sort(function(a, b) {
      if (a.schedule < b.schedule)
        return -1;
      if (a.schedule > b.schedule)
        return 1;
      return 0;
    });

    var loggedPinConfig = false;
    for (var i = 0; i < sortedEvents.length; i++) {
      registerEvent(microController, pin, sortedEvents[i]);
      // Only need to register the pin config once
      if (!loggedPinConfig) {
        pinConfig.push({
          microController: microController,
          pin: pin
        });
        loggedPinConfig = true;
      }
    }
  };

  function registerEvent(microController, pin, event) {
    try {
      var eventIndex = pin.currentEvents.indexOf(event);
      var eventDate = new Date(event.schedule);
      var eventName = (microController + '-' + pin.pin + '-' + event.name + '-' + eventIndex); // Need index to make each event on a pin unique
      var h = eventDate.getHours();
      var m = eventDate.getMinutes();
      var s = eventDate.getSeconds();
      var log = function(stage) {
        console.log(stage + 'on pin ' + pin.pin + ' (' + event.name + ' ' + event.type + ' ' + event.typeConfig + ')');
      };

      var scheduledJob = function() {
        var scheduledFunction = function() {
          log('Event called ');
          ioLibrary.callEvent(eventName);
        };

        // Register scheduled task
        scheduler.createJob(eventName, {
          hour: h,
          minute: m,
          second: s
        }, scheduledFunction);

        var scheduledDate = new Date(event.schedule);
        var eventSchedule = new Date().setHours(scheduledDate.getHours(), scheduledDate.getMinutes(), scheduledDate.getSeconds());
        // Only execute event if its time slot has passed
        if (eventSchedule < new Date() ? true : false) {
          console.log('immediate execute for pin:' + pin.pin + ' event:' + event.name + ', ' + eventSchedule);
          ioLibrary.callEvent(microController, pin, sortedEvents[i]);
        }
      };

      jobAgenda.push(scheduledJob);

      log('Event scheduled ');
    } catch (e) {
      console.log(e);
    }
  };

})(module.exports)
