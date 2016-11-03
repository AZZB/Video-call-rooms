


let PublicRoom = {
   pubRoomCh: null,

   join(socket){
     this.pubRoomCh = socket.channel("room:public")
     this.pubRoomCh.join()
               .receive("ok", resp => { console.log("Joined to public room successfully", resp) })
               .receive("error", resp => { console.log("Unable to join public room", resp) })
     this.setup()
   },
   setup(){
     let roomTable = document.getElementById("rooms-table")

     this.pubRoomCh.on("new:room", (resp) => {
       if(roomTable)  this.renderRoom(roomTable, resp)
     })

     this.pubRoomCh.on("delete:room", (id) => {
       console.log("delete room : ", id);
     })
   },

   renderRoom(container, {id, name, flag, user}){
     let template = document.createElement("tr")
     template.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${flag}</td>
        <td>${user}</td>
        <td><button class="btn btn-default btn-xs joinBtn" id=${id}>Join</button></td>
     `
     container.appendChild(template)
   }

}





export default PublicRoom
