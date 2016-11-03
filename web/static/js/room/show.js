import socket from "../socket"
import PrivateRoom from "../private_room"

let div = document.getElementById("show-room")
let room_id = div.getAttribute("data-room-id")
let flag = div.getAttribute("data-flag")
let isJoiner
if(flag == "full"){
  isJoiner = true
  console.log("hiiiiiiiii I'm shoooooooooow yes full");
} else {
  isJoiner = false
  console.log("hiiiiiiiii I'm shoooooooooow yes free");

}

PrivateRoom.join(socket, room_id, isJoiner)
