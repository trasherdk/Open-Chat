$(() => {
    
          var prev;
          var socket = io();
          var ready = false;

          $('#login').show();
          $("#login").submit((event) => {
            event.preventDefault();
          });
    
          $('#usersubmit').click(() => {
            if ($('#user').val().replace(/\s/g, ''))
              var nick = $('#user').val();
            socket.emit("join", nick);
            ready = true;
            console.log(ready)
            $(".mainwrapper").css('display','flex');
            $('#login').hide();
          });
    
          $("#sendform").submit( () => {
            if ($('#m').val() == '')
              return false;
            socket.emit('chat message', $('#m').val());
            $('#m').val('');
            return false;
          });
          
          if(ready){
            socket.on("add-person", (nick) => {
                $('#online').append('<li>'+nick);
              })
          }
          
    
          socket.on("remove-person", (nick) => {
            console.log(nick);
            $('#'+nick).remove();
          });
    
          socket.on("update", (msg) => {
            $('#messages').append('<li id="update" >' + msg);
          });
    
          socket.on("people-list", (people) => {
            var x;
            for (x in people) {
              $('#online').append('<li id="' + people[x].id + '">' + people[x].nick);
            }
          });
    
          socket.on("disconnect", () => {
            $('#messages').append("<li id=\"update\">You have lost connection to server. Refresh Page to restore connection.");
            $('#sendform').hide();
          });
          socket.on('chat message', (nick, msg) => {
            if (prev == nick) {
              $('#messages li:last-child > div').append("<div>" + msg + "</div>");
            } else {
              $('#messages').append("<li> <strong>" + nick + "</strong> : " + "<div id=\"innermsg\">" + msg + "</div></li>");
            }
    
            prev = nick;
            $("#messages").animate({
              scrollTop: $('#messages').prop("scrollHeight")
            }, 100);
          });
    
    
        });