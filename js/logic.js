//settings.json is the local settings file, this should be handled by the pc-module stuff
let settings = require('./settings.json');
let r = require('rethinkdb');

var intervalHolder;
var currentPage = '';
var currentSet = 0;
var rankingData = [];

//Twitch Stream stuff, set up the player muted and paused.
var options = {
  width: window.innerWidth - 30,
  height: window.innerHeight - 80,
  channel: "",
};
let player = new Twitch.Player("streamPlayer", options);
player.setVolume(0.0);
player.pause();


//This section handles all connections to rethink
r.connect({
  host: settings.serverAddress,
  port: settings.serverPort
}, function (err, connection) {

  //Runs when the rankings row updates
  r.db(settings.db).table(settings.table).get('rankings').changes({
    includeInitial: true
  }).run(connection, function (err, cursor) {
    cursor.each(updateRankings);
  });

  //Runs when the schedule row updates
  r.db(settings.db).table(settings.table).get('schedule').changes({
    includeInitial: true
  }).run(connection, function (err, cursor) {
    cursor.each(updateSchedule);
  });

  //Runs when the stream row updates
  r.db(settings.db).table(settings.table).get('streamSettings').changes({
    includeInitial: true
  }).run(connection, function (err, cursor) {
    cursor.each(updateStream);
  });

  //Runs when page settings row updates
  r.db(settings.db).table(settings.table).get('pageSettings').changes({
    includeInitial: true
  }).run(connection, function (err, cursor) {
    cursor.each(updatePage);
  });
});


//Functions to handle changes seen in rethink.
function updateRankings(err, ranks) {
  //Update the global data with the new rankings data,
  //run the splitter to make sure the next view will render correctly.
  window.rankingData = ranks.new_val.value;
  rankingsSplitter();
}

function updateSchedule(err, scheduleData) {
  let table = $('#scheduleTable').DataTable();
  table.clear();
  table.rows.add(scheduleData.new_val.value);
  table.draw();
}

function updateStream(err, streamData) {
  console.log(streamData);
}

function updatePage(err, pageData) {
  const pages = ['ranksView', 'scheduleView', 'streamView', 'logoView'];

  currentPage = pageData.new_val.value;
  clearInterval()
  pages.forEach(function (page) {
    if (page == currentPage) {
      $('#' + page).removeClass('d-none');
    } else {
      $('#' + page).addClass('d-none');
    }
  })


  if (currentPage == 'ranksView') {
    intervalHolder = window.setInterval(rankingsSplitter, settings.timePerSlide * 1000);
  } else {
    clearInterval(intervalHolder);
  }
}

function rankingsSplitter() {
  let maxPerPage = settings.teamsPerSlide;
  let teamCount = window.rankingData.length;
  let pagesNeeded = Math.ceil(teamCount / maxPerPage);

  let startIdx = window.currentSet * maxPerPage;
  let endIdx = (window.currentSet + 1) * maxPerPage;

  let table = $('#ranksTable').DataTable();
  table.clear();
  table.rows.add(window.rankingData.slice(startIdx, endIdx));
  table.draw();

  window.currentSet = (window.currentSet + 1) % pagesNeeded;
}