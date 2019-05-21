$(document).ready(function () {
  //Handle the SCHEDULE table
  //TODO: think about timezone stuff, test this on a pi soon.
  $('#scheduleTable').DataTable({
    "searching": false,
    "ordering": false,
    "paging": false,
    "info": false,
    "columns": [
      {
        data: "matchString",
        className: 'table-center',
        title: "Match"
},
      {
        data: "ally1",
        className: 'table-center',
        title: "Ally 1"
},
      {
        data: "ally2",
        className: 'table-center',
        title: "Ally 2"
},
      {
        data: "oppo1",
        className: 'table-center',
        title: "Oppo 1"
},
      {
        data: "oppo2",
        className: 'table-center',
        title: "Oppo 2"
},
      {
        data: "oppo3",
        className: 'table-center',
        title: "Oppo 3"
},
      {
        data: "scheduledTime",
        className: 'table-center',
        title: "Scheduled Time",
        render: function (data, type, row) {
          return moment(data * 1000).format("ddd, h:mm A");
        }
},
      {
        data: "predictedTime",
        className: 'table-center',
        title: "Predicted Time",
        render: function (data, type, row) {
          return moment(data * 1000).format("ddd, h:mm A");
        }
},
      {
        data: "redScore",
        className: 'table-center',
        title: "Red Score"
},
      {
        data: "blueScore",
        className: 'table-center',
        title: "Blue Score"
},
      {
        data: "matchOutcome",
        className: 'table-center',
        title: "Outcome"
},
      {
        data: "bumperColor",
        visible: false
      }],

    rowCallback: function (row, data, index) {

      //Handle assigning bumper colors to ally and oppo columns
      if (data.bumperColor == "red") {
        $(row).find('td:eq(1)').addClass('red');
        $(row).find('td:eq(2)').addClass('red');
        $(row).find('td:eq(3)').addClass('blue');
        $(row).find('td:eq(4)').addClass('blue');
        $(row).find('td:eq(5)').addClass('blue');
      } else {
        $(row).find('td:eq(1)').addClass('blue');
        $(row).find('td:eq(2)').addClass('blue');
        $(row).find('td:eq(3)').addClass('red');
        $(row).find('td:eq(4)').addClass('red');
        $(row).find('td:eq(5)').addClass('red');
      }

      //Default to putting red and blue in the score columns
      $(row).find('td:eq(8)').addClass('red');
      $(row).find('td:eq(9)').addClass('blue');

      //If red/blue win then add the win class
      if (data.redScore > data.blueScore) {
        $(row).find('td:eq(8)').addClass('redWin');
      }
      if (data.blueScore > data.redScore) {
        $(row).find('td:eq(9)').addClass('blueWin');
      }

      //Handle the win / loss / tie formatting
      $(row).find('td:eq(10)').addClass(data.matchOutcome.toLowerCase());
    }
  });
});