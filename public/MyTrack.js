function MyTrack(){

    var track = document.getElementById('track').value;
    var params = getHashParams();

var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

    $.ajax({
        url: 'https://api.spotify.com/v1/audio-analysis/'+track,
        headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response){
              Answer(response);
          },
          dataType: "json"

    });
    return false;
}

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  function Answer(response){
      console.log(response);
    var Letters = ["C","C#/Db","D","D#/Eb","E","F","F#/Gb","G","G#/Ab","A","A#/Bb","B"];
    var Lettercase = ["minor","Major"];

    return document.getElementById("Results").innerHTML = "The key of this track is "+Letters[response.track.key]+Lettercase[response.track.mode];
  }