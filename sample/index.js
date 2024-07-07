let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");

let roomId = document.getElementById("room_id");
let trackName = document.getElementById("track");
let memberOutput = document.getElementById("members");

socket.onopen = () => {
    console.log("Connected");
}

socket.onclose = e => {
    console.log("Connection closed: ", e);
    socket.send("Client closed");
}

socket.onerror = err => {
    console.log("Error occurred: ", err);
}

socket.onmessage = e => {
    roomId.innerText = "";
    trackName.innerText = "";
    memberOutput.innerHTML = "";
    
    let data = JSON.parse(e.data);

    if (data.status !== "success") {
        roomId.innerText = "Offline!"
        trackName.innerText = ""
        memberOutput.innerHTML = "" // Initialize element
        return;
    }
    roomId.innerText = data.id;
    trackName.innerText = data.setting.course;
    data.members.forEach(v => {
        memberOutput.innerHTML += `<li>${v.name}</li>`
        if (v.guest_name) memberOutput.innerHTML += `<li>${v.guest_name}</li>`
    })
}
