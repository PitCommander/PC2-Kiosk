//settings.json is the local settings file, this should be handled by the pc-module stuff
let settings = require('./settings.json');
let r = require('rethinkdb');

//This section handles all connections to rethink
r.connect({
  host: settings.serverAddress,
  port: settings.serverPort
}, function (err, connection) {
  //Runs when the schedule row updates
  r.db(settings.db).table(settings.table).get('schedule').changes({
    includeInitial: true
  }).run(connection, function (err, cursor) {
    cursor.each(updateSchedule);
  });
});

function updateSchedule(err, scheduleData) {
  let table = $('#scheduleTable').DataTable();
  table.clear();
  table.rows.add(scheduleData.new_val.value);
  table.draw();
}