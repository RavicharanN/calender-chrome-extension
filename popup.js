// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
    '?v=1.0&q=' + encodeURIComponent(searchTerm);
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || !response.responseData || !response.responseData.results ||
        response.responseData.results.length === 0) {
      errorCallback('No response from Google Image search!');
      return;
    }
    var firstResult = response.responseData.results[0];
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult.tbUrl;
    var width = parseInt(firstResult.tbWidth);
    var height = parseInt(firstResult.tbHeight);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected respose from the Google Image Search API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    // Put the image URL in Google search.
    renderStatus('Performing Google Image search for ' + url);

    getImageUrl(url, function(imageUrl, width, height) {

      renderStatus('Search term: ' + url + '\n' +
          'Google image search result: ' + imageUrl);
      var imageResult = document.getElementById('image-result');
      // Explicitly set the width/height to minimize the number of reflows. For
      // a single image, this does not matter, but if you're going to embed
      // multiple external images in your page, then the absence of width/height
      // attributes causes the popup to resize multiple times.
      imageResult.width = width;
      imageResult.height = height;
      imageResult.src = imageUrl;
      imageResult.hidden = false;

    }, function(errorMessage) {
      renderStatus('Cannot display image. ' + errorMessage);
    });
  });
});
var Calendar = function(o) {
  //Store div id
  this.divId = o.ParentID;

  // Days of week, starting on Sunday
  this.DaysOfWeek = o.DaysOfWeek;

  console.log("this.DaysOfWeek == ", this.DaysOfWeek)

  // Months, stating on January
  this.Months = o.Months;

  console.log("this.Months == ", this.Months)

  // Set the current month, year
  var d = new Date();

  console.log("d == ", d)

  this.CurrentMonth = d.getMonth();

  console.log("this.CurrentMonth == ", this.CurrentMonth);

  this.CurrentYear = d.getFullYear();

  console.log("this.CurrentYear == ", this.CurrentYear);

  var f=o.Format;

  console.log("o == ", o);

  console.log("f == ", f);

  //this.f = typeof(f) == 'string' ? f.charAt(0).toUpperCase() : 'M';

  if(typeof(f) == 'string') {
    this.f  = f.charAt(0).toUpperCase();
  } else {
    this.f = 'M';
  }

  console.log("this.f == ", this.f);
};

// Goes to next month
Calendar.prototype.nextMonth = function() {
  console.log("Calendar.prototype.nextMonth = function() {");

  if ( this.CurrentMonth == 11 ) {
    console.log("this.CurrentMonth == ", this.CurrentMonth);

    this.CurrentMonth = 0;

    console.log("this.CurrentMonth == ", this.CurrentMonth);

    console.log("this.CurrentYear == ", this.CurrentYear);

    this.CurrentYear = this.CurrentYear + 1;

    console.log("this.CurrentYear == ", this.CurrentYear);
  } else {
    console.log("this.CurrentMonth == ", this.CurrentMonth);

    this.CurrentMonth = this.CurrentMonth + 1;

    console.log("this.CurrentMonth + 1 == ", this.CurrentMonth);
  }

  this.showCurrent();
};

// Goes to previous month
Calendar.prototype.previousMonth = function() {
  console.log("Calendar.prototype.previousMonth = function() {");

  if ( this.CurrentMonth == 0 ) {
    console.log("this.CurrentMonth == ", this.CurrentMonth);

    this.CurrentMonth = 11;

    console.log("this.CurrentMonth == ", this.CurrentMonth);

    console.log("this.CurrentYear == ", this.CurrentYear);

    this.CurrentYear = this.CurrentYear - 1;

    console.log("this.CurrentYear == ", this.CurrentYear);
  } else {
    console.log("this.CurrentMonth == ", this.CurrentMonth);

    this.CurrentMonth = this.CurrentMonth - 1;

    console.log("this.CurrentMonth - 1 == ", this.CurrentMonth);
  }

  this.showCurrent();
};

// 
Calendar.prototype.previousYear = function() {
  console.log(" ");

  console.log("Calendar.prototype.previousYear = function() {");

  console.log("this.CurrentYear == " + this.CurrentYear);

  this.CurrentYear = this.CurrentYear - 1;

  console.log("this.CurrentYear - 1 i.e. this.CurrentYear == " + this.CurrentYear);

  this.showCurrent();
}

// 
Calendar.prototype.nextYear = function() {
  console.log(" ");

  console.log("Calendar.prototype.nextYear = function() {");

  console.log("this.CurrentYear == " + this.CurrentYear);

  this.CurrentYear = this.CurrentYear + 1;

  console.log("this.CurrentYear - 1 i.e. this.CurrentYear == " + this.CurrentYear);

  this.showCurrent();
}              

// Show current month
Calendar.prototype.showCurrent = function() {
  console.log(" ");

  console.log("Calendar.prototype.showCurrent = function() {");

  console.log("this.CurrentYear == ", this.CurrentYear);

  console.log("this.CurrentMonth == ", this.CurrentMonth);

  this.Calendar(this.CurrentYear, this.CurrentMonth);
};

// Show month (year, month)
Calendar.prototype.Calendar = function(y,m) {
  console.log(" ");

  console.log("Calendar.prototype.Calendar = function(y,m){");

  typeof(y) == 'number' ? this.CurrentYear = y : null;

  console.log("this.CurrentYear == ", this.CurrentYear);

  typeof(y) == 'number' ? this.CurrentMonth = m : null;

  console.log("this.CurrentMonth == ", this.CurrentMonth);

  // 1st day of the selected month
  var firstDayOfCurrentMonth = new Date(y, m, 1).getDay();

  console.log("firstDayOfCurrentMonth == ", firstDayOfCurrentMonth);

  // Last date of the selected month
  var lastDateOfCurrentMonth = new Date(y, m+1, 0).getDate();

  console.log("lastDateOfCurrentMonth == ", lastDateOfCurrentMonth);

  // Last day of the previous month
  console.log("m == ", m);

  var lastDateOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();

  console.log("lastDateOfLastMonth == ", lastDateOfLastMonth);

  console.log("Print selected month and year.");

  // Write selected month and year. This HTML goes into <div id="year"></div>
  //var yearhtml = '<span class="yearspan">' + y + '</span>';

  // Write selected month and year. This HTML goes into <div id="month"></div>
  //var monthhtml = '<span class="monthspan">' + this.Months[m] + '</span>';

  // Write selected month and year. This HTML goes into <div id="month"></div>
  var monthandyearhtml = '<span id="monthandyearspan">' + this.Months[m] + ' - ' + y + '</span>';

  console.log("monthandyearhtml == " + monthandyearhtml);

  var html = '<table>';

  // Write the header of the days of the week
  html += '<tr>';

  console.log(" ");

  console.log("Write the header of the days of the week");

  for(var i=0; i < 7;i++) {
    console.log("i == ", i);

    console.log("this.DaysOfWeek[i] == ", this.DaysOfWeek[i]);

    html += '<th class="daysheader">' + this.DaysOfWeek[i] + '</th>';
  }

  html += '</tr>';

  console.log("Before conditional operator this.f == ", this.f);

  //this.f = 'X';

  var p = dm = this.f == 'M' ? 1 : firstDayOfCurrentMonth == 0 ? -5 : 2;

  /*var p, dm;

  if(this.f =='M') {
    dm = 1;

    p = dm;
  } else {
    if(firstDayOfCurrentMonth == 0) {
      firstDayOfCurrentMonth == -5;
    } else {
      firstDayOfCurrentMonth == 2;
    }
  }*/

  console.log("After conditional operator");

  console.log("this.f == ", this.f);

  console.log("p == ", p);

  console.log("dm == ", dm);

  console.log("firstDayOfCurrentMonth == ", firstDayOfCurrentMonth);

  var cellvalue;

  for (var d, i=0, z0=0; z0<6; z0++) {
    html += '<tr>';

    console.log("Inside 1st for loop - d == " + d + " | i == " + i + " | z0 == " + z0);

    for (var z0a = 0; z0a < 7; z0a++) {
      console.log("Inside 2nd for loop");

      console.log("z0a == " + z0a);

      d = i + dm - firstDayOfCurrentMonth;

      console.log("d outside if statm == " + d);

      // Dates from prev month
      if (d < 1){
        console.log("d < 1");

        console.log("p before p++ == " + p);

        cellvalue = lastDateOfLastMonth - firstDayOfCurrentMonth + p++;

        console.log("p after p++ == " + p);

        console.log("cellvalue == " + cellvalue);

        html += '<td id="prevmonthdates">' + 
              '<span id="cellvaluespan">' + (cellvalue) + '</span><br/>' + 
              '<ul id="cellvaluelist"><li>apples</li><li>bananas</li><li>pineapples</li></ul>' + 
            '</td>';

      // Dates from next month
      } else if ( d > lastDateOfCurrentMonth){
        console.log("d > lastDateOfCurrentMonth");

        console.log("p before p++ == " + p);

        html += '<td id="nextmonthdates">' + (p++) + '</td>';

        console.log("p after p++ == " + p);

      // Current month dates
      } else {
        html += '<td id="currentmonthdates">' + (d) + '</td>';
        
        console.log("d inside else { == " + d);

        p = 1;

        console.log("p inside } else { == " + p);
      }
      
      if (i % 7 == 6 && d >= lastDateOfCurrentMonth) {
        console.log("INSIDE if (i % 7 == 6 && d >= lastDateOfCurrentMonth) {");

        console.log("i == " + i);

        console.log("d == " + d);

        console.log("z0 == " + z0);

        z0 = 10; // no more rows
      }

      console.log("i before i++ == " + i);

      i++;

      console.log("i after i++ == " + i);            
    }

    html += '</tr>';
  }

  // Closes table
  html += '</table>';

  // Write HTML to the div
  //document.getElementById("year").innerHTML = yearhtml;

  //document.getElementById("month").innerHTML = monthhtml;

  document.getElementById("monthandyear").innerHTML = monthandyearhtml;

  document.getElementById(this.divId).innerHTML = html;
};

// On Load of the window
window.onload = function() {
  
  // Start calendar
  var c = new Calendar({
    ParentID:"divcalendartable",

    DaysOfWeek:[
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
    'SUN'
    ],

    Months:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],

    Format:'dd/mm/yyyy'
  });

  c.showCurrent();
  
  // Bind next and previous button clicks
  getId('btnPrev').onclick = function(){
    c.previousMonth();
  };

  getId('btnPrevYr').onclick = function(){
    c.previousYear();
  };

  getId('btnNext').onclick = function(){
    c.nextMonth();
  };

  getId('btnNextYr').onclick = function(){
    c.nextYear();
  };                        
}

// Get element by id
function getId(id) {
  return document.getElementById(id);
}
