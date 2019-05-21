//settings.json is the local settings file, this should be handled by the pc-module stuff
let settings = require('./settings.json');
let r = require('rethinkdb');

var connection = null;

//This section handles all connections to rethink
r.connect({
  host: settings.serverAddress,
  port: settings.serverPort
}, function (err, connection) {
  window.connection = connection;

  //Runs when the schedule row updates
  r.db(settings.db).table(settings.table).get('schedule').changes({
    includeInitial: true
  }).run(connection, function (err, cursor) {
    cursor.each(updateSchedule);
  });
});

//Templating stuff for element layouts
let Handlebars = require('handlebars');
let source = document.getElementById("tv-template").innerHTML;
let template = Handlebars.compile(source);

let tvs = {
  'tv': ['Left', 'Right', 'Inner']
};

let result = template(tvs);
$('#tvHolder').append(result);

$('label.btn.orange-btn').click(function () {
  sendScreenUpdate($(this)[0].parentElement.id, $(this)[0].id);
})


//Functions for sending and receiving from rethink
function updateSchedule(err, scheduleData) {
  let table = $('#scheduleTable').DataTable();
  table.clear();
  table.rows.add(scheduleData.new_val.value);
  table.draw();
}

function sendScreenUpdate(screen, page) {
  r.db(settings.db).table(settings.table).get('screenSettings').update({
    "value": {
      [screen]: page
    }
  }).run(window.connection, function (err, res) {});
}