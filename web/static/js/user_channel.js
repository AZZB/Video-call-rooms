import PrivateRoom from "./private_room"

let UserChannel = {
  userChan: null,
  mSocket: null,

  join(socket){
    this.mSocket = socket
    let user = document.getElementById('user_id').innerText
    this.userChan = socket.channel(`user:Azz`)
    this.setup()

    this.userChan.join()
      .receive("ok", resp => { console.log("Joined users topic successfully", resp) })
      .receive("error", resp => { console.log("Unable to join users topic", resp) })

  },

  setup(){
    console.log("setup user");

    this.userChan.on("sub:room", (resp) => {
      console.log("inside sub room ", resp);
      this.joinToPrivateRoom(resp.room_id ,false)
    })
  },

  joinToPrivateRoom(id ,isJoiner){
    PrivateRoom.join(this.mSocket, id, isJoiner)
  },

  send(data){
    this.userChan.push("test", data)
  }
}

export default UserChannel
