$(function() {

  var $latitude = $('#latitude');
  var $longitude = $('#longitude');
  var $year = $('#year');
  var $month = $('#month');
  var $day = $('#day');
  var $calculate = $('#calculate');
  var $spinner = $('#spinner');
  var $error = $('#error');
  var $result = $('#result');
  var $sunrise = $('#sunrise');
  var $sunset = $('#sunset');

  // Dispatch the API request
  $calculate.click(function() {
    $spinner.show();
    $error.hide();
    $result.hide();
    $.ajax({
      type: 'POST',
      url: '/api',
      data: JSON.stringify({
        latitude: parseFloat($latitude.val()),
        longitude: parseFloat($longitude.val()),
        year: parseInt($year.val()),
        month: parseInt($month.val()),
        day: parseInt($day.val())
      }),
      contentType: 'application/json'
    })
    .done(function(d) {
      if ('error' in d) {
        $error.text("Error: " + d.error).show();
      } else {
        var sunrise = moment.tz(d.sunrise, moment.tz.guess());
        var sunset = moment.tz(d.sunset, moment.tz.guess());
        $('.time', $sunrise).text(sunrise.format('h:mma'));
        $('.timezone', $sunrise).text(sunrise.format('z'));
        $('.time', $sunset).text(sunset.format('h:mma'));
        $('.timezone', $sunset).text(sunset.format('z'));
        $result.show();
      }
    })
    .fail(function(jqXHR) {
      $error.text("Error: " + jqXHR.responseText).show();
    })
    .always(function() {
      $spinner.hide();
    });
  });

  // Auto-fill the date fields
  var m = moment();
  $year.val(m.year());
  $month.val(m.month() + 1);
  $day.val(m.date());

  // If location information is available, fill in the fields and simulate
  // clicking the calculate button
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      $latitude.val(pos.coords.latitude);
      $longitude.val(pos.coords.longitude);
      $calculate.click();
    });
  }

  // Focus the first input
  $('input:first').focus();

});
