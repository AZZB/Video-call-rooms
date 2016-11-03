/*
  if I've error I'll try to set handleError null
*/

import initWebRTCAdapter from './webrtc_adapter'
import {RTCPeerConnection, getUserMedia, attachMediaStream, webrtcDetectedBrowser} from './webrtc_adapter'


let WebRTCWrapper = {
  peerConnection: null,
  localVideo: null,
  remoteVideo: null,
  localStream: null,
  remoteStream: null,
  channel: null,
  pc_config: null,
  sdpConstraints: null,
  isJoiner: false,

  init(roomChan ,lv, rv, joiner){
    this.channel = roomChan
    this.setupChannel()
    this.isJoiner = joiner
    this.pc_config = {"iceServers": [{url:'stun:23.21.150.121'}, {url:'stun:stun.l.google.com:19302'}]}
    this.sdpConstraints = {'mandatory': {'OfferToReceiveAudio':true, 'OfferToReceiveVideo':true }}
    this.localVideo = lv
    this.remoteVideo = rv
    initWebRTCAdapter()
    console.log("the browser looks like ", webrtcDetectedBrowser)
    this.doGetUserMedia()
  },

  doGetUserMedia(){
    let constraints = {"audio": true, "video": {"mandatory": {}, "optional": []}}
    getUserMedia(constraints, this.onUserMediaSuccess.bind(this), (error) => {
      console.log("error getUserMedia : ", error);
    })
  },

  onUserMediaSuccess(stream){
    console.log("**************got user media stream success");
    attachMediaStream(this.localVideo, stream);
    this.localStream = stream;
    this.setupPeerConnection()

  },

  setupPeerConnection(){
    console.log("***********setup peer connection");
    let pc_constraints = {"optional": [{"DtlsSrtpKeyAgreement": true}]};
    try {
      this.peerConnection =  new RTCPeerConnection(this.pc_config, pc_constraints);
      this.peerConnection.onicecandidate = this.gotLocalIceCandidate.bind(this);
      this.peerConnection.onaddstream = this.onRemoteStreamAdded.bind(this);
      console.log("Added localStream to localPeerConnection");
      this.peerConnection.addStream(this.localStream)
    } catch (e) {
      this.peerConnection = null
      console.log("error setup peer: ", e);
      return
    }

    if(this.isJoiner) this.doCall()
  },

  gotLocalIceCandidate(event){
    if(event.candidate){
      console.log("Local ICE candidate: \n" + event.candidate.candidate);
      this.channel.push("message", {body: JSON.stringify({
          "candidate": event.candidate
      })});
    }
  },

  onRemoteStreamAdded(event){
    console.log("***********stream remote added");
    attachMediaStream(this.remoteVideo, event.stream)
    this.remoteStream = event.stream
  },

  doCall(){
    let constraints = {"optional": [], "mandatory": {"MozDontOfferDataChannel": true}};
    if (webrtcDetectedBrowser === "chrome") {
      for (var prop in constraints.mandatory){
        if (prop.indexOf("Moz") != -1) delete constraints.mandatory[prop];
      }
    }
    constraints = this.mergeConstraints(constraints, this.sdpConstraints);
    this.peerConnection.createOffer(this.gotLocalDescription.bind(this), this.handleError.bind(this), constraints);
  },

 doAnswer() {
    this.peerConnection.createAnswer(this.gotLocalDescription.bind(this), this.handleError.bind(this), this.sdpConstraints)
  },

  gotLocalDescription(description){
    console.log("description:: ", description);
    this.peerConnection.setLocalDescription(description, () => {
        this.channel.push("message", { body: JSON.stringify({
                "sdp": this.peerConnection.localDescription
            })});
        }, this.handleError.bind(this));
    console.log("Offer from localPeerConnection: \n" + description.sdp);

  },

  gotRemoteDescription(description){
    console.log("Answer from remotePeerConnection: \n" + description.sdp);
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(description.sdp));
    this.doAnswer()
  },

  gotRemoteIceCandidate(event){
    if (event.candidate) {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
      console.log("Remote ICE candidate: \n " + event.candidate.candidate);
    }
  },

  mergeConstraints(cons1, cons2) {
      let merged = cons1;
      for (var name in cons2.mandatory) merged.mandatory[name] = cons2.mandatory[name];
      merged.optional.concat(cons2.optional);
      return merged;
  },

  handleError(error) {
    console.log(error.name + ": " + error.message);
  },

  hangup(){
    peerConnection.close()
    localVideo.src = null
    remoteVideo.src = null
    peerConnection = null
    channel.push("close", {joiner: isJoiner})
  },

  setupChannel(){
    this.channel.on("message", (resp) => {
      let message = JSON.parse(resp.body);
      if (message.sdp) {
        this.gotRemoteDescription(message);
      } else {
        this.gotRemoteIceCandidate(message);
      }
    })
  }
}

export default WebRTCWrapper
