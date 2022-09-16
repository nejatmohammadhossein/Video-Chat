const socket = io();
const myPeer = new Peer(undefined,{
    host:'/',
    port:'3001'
})
const videoGrid = document.getElementById('video-grid');
const video = document.createElement('video');
const peers = {}
//video.muted = true;
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    myVideoStream = stream;
    const otherPeer = new Peer(undefined,{
        host:'/',
        port:'3001'
    })
    socket.on('user-disconnected', userId => {
        console.log(userId);
        if (peers[userId]){
            peers[userId].close();
        }
        
    })
    otherPeer.on('open',id=>{
        socket.emit('join-room',Room_ID, id);
    })
    addVideoStream(video, stream);

    socket.on('user-connected',userId =>{
        //console.log("user "+userId+" connected to room: "+Room_ID);
        connectToNewUser(userId, stream);
    })
    otherPeer.on('call', call =>{
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video,userVideoStream);
        })
    })
    
    const muteButton = document.querySelector("#muteButton");
    const stopVideo = document.querySelector("#stopVideo");
    const inviteButton = document.querySelector("#inviteButton");
    muteButton.addEventListener("click", () => {
        console.log(myVideoStream.getAudioTracks()[0].enabled);
        const enabled = myVideoStream.getAudioTracks()[0].enabled;
        if(enabled){
            myVideoStream.getAudioTracks()[0].enabled = false;
            html = `<i class = "fas fa-microphone-slash"></i>`;
            muteButton.classList.add("back_red");
            muteButton.innerHTML = html;
            
        }else{
            myVideoStream.getAudioTracks()[0].enabled = true;
            html = `<i class = "fas fa-microphone"></i>`;
            muteButton.classList.remove("back_red");
            muteButton.innerHTML = html;
        }
    })

    stopVideo.addEventListener("click", () => {
        console.log(myVideoStream.getVideoTracks()[0].enabled);
        const enabled = myVideoStream.getVideoTracks()[0].enabled;
        if(enabled){
            myVideoStream.getVideoTracks()[0].enabled = false;
            html = `<i class = "fas fa-video-slash"></i>`;
            stopVideo.classList.add("back_red");
            stopVideo.innerHTML = html;
            
        }else{
            myVideoStream.getVideoTracks()[0].enabled = true;
            html = `<i class = "fas fa-video"></i>`;
            stopVideo.classList.remove("back_red");
            stopVideo.innerHTML = html;
        }
    })

    inviteButton.addEventListener("click", () => {
        prompt("برای دعوت دیگران به چتروم ویدیویی آدرس زیر را کپی کنید",
            window.location.href
        )

    })

    
   
})

function connectToNewUser (userId, stream){
    const call = myPeer.call(userId,stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream =>{
        addVideoStream(video,userVideoStream);
    })

    call.on('close', () =>{
        video.remove();
    })

  
    
    peers[userId] = call;

}



function addVideoStream(video, stream){
    video.srcObject = stream;
   
        video.play()
      
    videoGrid.append(video);
}