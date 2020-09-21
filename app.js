//  =========>>>>>>>> Declaring two eompty variables >>>>>>>>>========== //


var currentUserKey = "";
var chatKey = "";

//  °•°•°•°•°•°•°•°•°•°•°•° START CHAT FUNCTION WHICH :-  °•°•°•°•°•°•°•°•°•°•°•° 

function startChat(friendKey, friendName, friendPhoto) {

  var friendList = { friendId: friendKey, userId: currentUserKey };
  var db = firebase.database().ref("friend_list");
  var flag = false;

  db.on("value", function (friends) {

    friends.forEach(function (data) {
      var user = data.val();
      if ((user.friendId === friendList.friendId && user.userId === friendList.userId) || (user.friendId === friendList.userId && user.userId === friendList.friendId)) {
        flag = true
        chatKey = data.key;
      }
    })

    if (flag === false) {
      chatKey = firebase.database().ref('friend_list').push(friendList, function (error) {
        if (error) alert(error);
        else {
          document.getElementById("chatPanel").removeAttribute("style")
          document.getElementById("divStart").setAttribute("style", 'display:none')
        }
      }).getKey();
    }

    else {
      document.getElementById("chatPanel").removeAttribute("style")
      document.getElementById("divStart").setAttribute("style", 'display:none')
    }

    // display name and photo 
    document.getElementById('divChatName').innerHTML = friendName;
    document.getElementById('imgChat').src = friendPhoto;

    /////////////////////////////////////////////////////////////

    document.getElementById("messages").innerHTML =""

    onKeyDown()
    document.getElementById("txtmessage").value = '';
    document.getElementById("txtmessage").focus();
    document.getElementById("messages").scrollTo(0, document.getElementById("messages").clientHeight)

    // dsplaying chat messages
    LoadChatMessages(chatKey);
  })

}

// °•°•°•°•°•°•°•°•°•°•°•° LOAD CHAT MESSAGES :- °•°•°•°•°•°•°•°•°•°•°•° 
function LoadChatMessages(chatKey) {
  var db = firebase.database().ref("chatMessages").child(chatKey)
  db.on('value', function (chats) {
    var messageDisplay = ''
    chats.forEach(function (data) {
      var chat = data.val()
      if (chat.userId !== currentUserKey) {
        messageDisplay += `
                          <div class="row">
                          <div class="col-md-6 col-sm-6 col-5">
                          <p class="receive">
                          ${chat.msg}
                          </p>
                          </div>
                          </div>
                          `
      }
      else {
        messageDisplay += ` <div class="row justify-content-end">
                            <div class="col-md-6 col-sm-6 col-6">
                            <p class="sent float-right">
                            ${chat.msg}
                            </p>
                            </div>
                            </div>
                            `
      }
    })
    document.getElementById("messages").innerHTML = messageDisplay;
    document.getElementById("messages").scrollTo(0, document.getElementById("messages").clientHeight)
  })
}

//  °•°•°•°•°•°•°•°•°•°•°•° ON KEY DOWN :- °•°•°•°•°•°•°•°•°•°•°•° 
function onKeyDown() {
  document.addEventListener('keydown', function (key) {
    if (key.which == 13) {
      sendMessage()
    }
  })
}


  // °•°•°•°•°•°•°•°•°•°•°•° ON KEY DOWN :-  °•°•°•°•°•°•°•°•°•°•°•° 
function sendMessage() {
  var chatMessage = {
    userId: currentUserKey,
    msg: document.getElementById("txtmessage").value
  };
  firebase.database().ref("chatMessages").child(chatKey).push(chatMessage, function (error) {
    if (error) alert(error)
    else {
      document.getElementById("txtmessage").value = '';
      document.getElementById("txtmessage").focus()
      document.getElementById("messages").scrollTo(0, document.getElementById("messages").clientHeight)
    }
  })
}

  // °•°•°•°•°•°•°•°•°•°•°•° LOAD CHAT LIST :-  °•°•°•°•°•°•°•°•°•°•°•° 
function LoadChatList() {
  var db = firebase.database().ref("friend_list")
  db.on('value', function (lists) {
    /*document.getElementById('lstChat').innerHTML = `
    <li class="list-group-item"> <input type="text" placeholder="Search or New Chat" class="form-control form-rounded"> </li> `*/
    lists.forEach(function (data) {
      var lst = data.val()
      var friendKey = '';

      if (lst.friendId === currentUserKey) {
        friendKey = lst.userId;
      }
      else if (lst.userId === currentUserKey) {
        friendKey = lst.friendId
      }

      if (friendKey!== ""){
        firebase.database().ref("users").child(friendKey).on("value", function (data) {
          var user = data.val()

          document.getElementById('lstChat').innerHTML += `
                                                          <li class="list-group-item" onclick="startChat('${data.key}', 
                                                          '${user.name}', '${user.photoURL}')">
                                                          <div class="row">
                                                          <div class="col-lg-2 col-md-2 col-sm-12 col-12">
                                                          <img src="${user.photoURL}" class="rounded-circle friendPic" alt="">
                                                          </div>
                                                          <div class="frndinfo" col-lg-10 col-md-10 col-sm-12 col-12" style="cursor: pointer;">
                                                          <div class="name d-none d-md-block " style="margin-top:10px;" id="name2">${user.name}</div>

                                                          </div>
                                                          </div>
                                                          </li>
                                                           `
                                                          // <div class="under-name d-none d-md-block" id="undername2">This is some message text...</div>

         })
      }
    })
  })
}

  // °•°•°•°•°•°•°•°•°•°•°•° POPULQTE FRIEND LIST :- °•°•°•°•°•°•°•°•°•°•°•° 
function populateFriendList() {
  //  document.getElementById("lstFriend").innerHTML=`<div><span class = "spinner-border text-primary"></span></div>`
  var db = firebase.database().ref('users')
  var lst = ""
  db.on('value', function (users) {
    if (users.hasChildren()) {
      lst = `
            <li class="list-group-item">
            <input type="text" placeholder="Search or New Chat" class="form-control form-rounded">
            </li>
            `   
    }
    users.forEach(function (data) {
      var user = data.val()
      
      if (user.email !== firebase.auth().currentUser.email) {
        lst += `
               <li class="list-group-item" data-dismiss="modal" onclick="startChat('${data.key}' , '${user.name}', '${user.photoURL}')">
              <div class="row">
              <div class="col-lg-2 col-md-2 col-sm-12 col-12">
              <img src="${user.photoURL}" class="rounded-circle friendPic" alt="">
              </div>
              <div class="col-lg-10 col-md-10 col-sm-12 col-12" style="cursor: pointer;">
              <div class="name d-none d-md-block" style="margin-top:10px;">${user.name}</div>
              </div>
              </div>
              </li>
              `   
      }
    })
    document.getElementById("lstFriend").innerHTML = lst
  })
}


  // °•°•°•°•°•°•°•°•°•°•°•° SIGN IN :-  °•°•°•°•°•°•°•°•°•°•°•° 
function signIn() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(e => {
    window.location = "main.html"
  });

}

  // °•°•°•°•°•°•°•°•°•°•°•° SIGN out :- °•°•°•°•°•°•°•°•°•°•°•° 
function signOut() {
  firebase.auth().signOut();
  window.location = "index.html"
}

  // °•°•°•°•°•°•°•°•°•°•°•° on firebase state changed :-  °•°•°•°•°•°•°•°•°•°•°•° 

function onFirebaseStateChanged() {
  firebase.auth().onAuthStateChanged(onStateChange);
}


  // °•°•°•°•°•°•°•°•°•°•°•° onstate changed **** when user is login  :- °•°•°•°•°•°•°•°•°•°•°•° 
function onStateChange(user) {
  if (user) {

    var userProfile = {
      email: '',
      name: '',
      photoURL: '',
      uid: ''
    }
    userProfile.email = firebase.auth().currentUser.email;
    userProfile.name = firebase.auth().currentUser.displayName;
    userProfile.photoURL = firebase.auth().currentUser.photoURL;
    // userProfile.uid = firebase.auth().currentUser.photoURL;
    var db = firebase.database().ref("users");
    var flag = false;
    db.on("value", function (users) {
      users.forEach(function (data) {
        var user = data.val();
        if (user.email === userProfile.email) {
          currentUserKey = data.key;
          flag = true;
        }
      })
      if (flag === false) {
        firebase.database().ref("users").push(userProfile, callback)
      }
      else {
        document.getElementById("imgProfile").src = firebase.auth().currentUser.photoURL;
        document.getElementById("userName").innerHTML = firebase.auth().currentUser.displayName;
      }
      LoadChatList();

    })
    function callback(error) {
      if (error) {
        alert("error")
      }
      else {
        document.getElementById("imgProfile").src = firebase.auth().currentUser.photoURL;
        document.getElementById("userName").innerHTML = firebase.auth().currentUser.displayName;
      }
    }
  }
  else {
    document.getElementById("imgProfile").src = "./img/profile-icon-png-910-Windows.ico"

    document.getElementById("userName").title = '';
  }
}


onFirebaseStateChanged()
   ////////////////////////////////////////////////////////
