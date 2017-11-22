$(function() {

  var $latitude = $('#latitude');
  var $longitude = $('#longitude');
  var $year = $('#year');
  var $month = $('#month');
  var $day = $('#day');
  var $calculate = $('#calculate');
  var $spinner = $('#spinner');
  var $result = $('#result');
  var $sunrise = $('#sunrise');
  var $sunset = $('#sunset');

  // Dispatch the API request
  $calculate.click(function() {
    $spinner.show();
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
      // TODO: error handling
      var sunrise = moment(d.sunrise);
      var sunset = moment(d.sunset);
      $sunrise.text(sunrise.format('h:mma'));
      $sunset.text(sunset.format('h:mma'));
      $result.show();
    })
    .fail(function() {
      //...
    })
    .always(function() {
      $spinner.hide();
    });
  });

  // Attempt to auto-load the information for the user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      var m = moment();
      $latitude.val(pos.coords.latitude);
      $longitude.val(pos.coords.longitude);
      $year.val(m.year());
      $month.val(m.month() + 1);
      $day.val(m.date());
      $calculate.click();
    });
  }

  // Focus the first input
  $('input:first').focus();

});
