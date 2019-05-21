let Handlebars = require('handlebars');
let source = document.getElementById("tv-template").innerHTML;
let template = Handlebars.compile(source);

let tvs = {
  'tv': ['Left', 'Right', 'Inner']
};
let result = template(tvs);
$('#tvHolder').append(result);