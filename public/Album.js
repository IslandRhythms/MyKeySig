function MyAlbum(){
    var album = document.getElementById('album').value;

    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;


        $.ajax({
            url: 'https://api.spotify.com/v1/albums/'+album+'/tracks',
            headers: {
                'Authorization': 'Bearer ' + access_token
              },
              success: function(response) {
                Result(response);
              },
              dataType:"json"

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

  function Execute(response){
    var query = [];
    var token = getHashParams();
  var newtoken = token.access_token;
    if(response.items.length > 1){
    for(var i = 0; i < response.items.length; i++){
     query.push(response.items[i].id);
   }
   query.join(",");
  

    $.ajax({
          url: 'https://api.spotify.com/v1/audio-features?ids='+query ,
          headers: {
            'Authorization': 'Bearer ' + newtoken
          },
          success: function(calls) {
            unlock(calls);
          },
          dataType:"json"
      });
    }
  }
  

  function Song(key,mode){
    this.key = key;
    this.mode = mode;
  }

  //determines the most frequent key and whether it is major or minor
  function unlock(calls){
    var scale = [];
    var compare = 0;
    var count = 0;
    var king = {
      key: "",
      mode: ""
    };
    var prince = {
      key: "",
      mode: ""
    };
    var tie = 0;
    for(var i = 0; i < calls.audio_features.length;i++)
    {
       var entry = new Song(calls.audio_features[i].key,calls.audio_features[i].mode);
      scale.push(entry);
      
    }

    //https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
    //https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
  
    //If king keeps its initial value at the end of the algorithm run, then it would mean no favorite key was achieved.
      scale.sort((a, b) => (a.key > b.key) ? 1 : -1);
     

    //king of the hill algorithm 
     for(var j = 0; j < scale.length - 1; j++)
    {

      if(JSON.stringify(scale[j]) === JSON.stringify(scale[j+1]))
      {
        count++;
      }
      else if(JSON.stringify(scale[j]) !== JSON.stringify(scale[j+1]) && count > compare)
      {
        king = scale[j];
        compare = count;
        count = 0;
      }
      else if(count > compare && JSON.stringify(scale[j]) === JSON.stringify(scale[j+1]))
      {
        king = scale[j];
      }
      else if(count == compare && king.key != "" && JSON.stringify(scale[j]) !== JSON.stringify(scale[j+1]))
      {
       tie++;
       prince = scale[j];
      }
      
    }
    output(king,prince,tie);
  }
  
  function output(king,prince,tie)
  {
    var Letters = ["C","C#/Db","D","D#/Eb","E","F","F#/Gb","G","G#/Ab","A","A#/Bb","B"];
    var Lettercase = ["minor","Major"];
    
    if(tie == 0)
    return document.getElementById("Results").innerHTML = "Your favorite key according to this playlist is "+Letters[king.key]+Lettercase[king.mode];
    if(king.key == "")
    return document.getElementById("Results").innerHTML = "No favorite key could be found."

    return document.getElementById("Results").innerHTML = "There was a "+(tie+1)+" way tie. The two keys that were determined first were "
    +Letters[king.key]+Lettercase[king.mode]+ " and "+Letters[prince.key]+Lettercase[prince.mode];
  }
  