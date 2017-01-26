var events = [
  {'Date': new Date(2017, 0, 26), 'Title': 'create chrome extension'},
  {'Date': new Date(2017, 0, 27), 'Title': 'complete chrome extension', 'Link': 'https://google.com'},
  {'Date': new Date(2017, 0, 28), 'Title': 'publish chrome extension', 'Link': 'https://www.google.com'},
];
var settings = {};
var element = document.getElementById('caleandar');
caleandar(element, events, settings);
