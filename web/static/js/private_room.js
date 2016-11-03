//import initWebRTC from "./webrtc_wrapper"
//console.log("starting", initWebRTC);
import WebRTCWrapper from './webrtc_wrapper'
//console.log("init webrtc:::: ", initWebRTC);

let PrivateRoom = {
  pRoomChan: null,
  isJoiner: false,
  join(socket, room_id, joiner){
    this.isJoiner = joiner
    console.log("from private ", room_id);
    this.pRoomChan = socket.channel(`room:${room_id}`)
    this.setup()
    this.pRoomChan.join()
            .receive("ok", this.successJoin.bind(this))
            .receive("error", resp => { console.log("Unable to join private room", resp) })

  },
  successJoin(resp){
    console.log("Joined to private room successfully", resp)
    let lv = document.getElementById("localVideo")
    let rv = document.getElementById("remoteVideo")
    WebRTCWrapper.init(this.pRoomChan ,lv, rv, this.isJoiner)
  },
  setup(){
    this.pRoomChan.on("try", (data) => {
      console.log("---- tryyyyyy : ", data);
      let elm = document.getElementById("room_id")
      console.log("elem is ", elm);
      elm.innerHTML = `data ${data.name}`
    })
  }
}

export default PrivateRoom
