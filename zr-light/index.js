let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");

let room_id = document.getElementById("room_id");
let course = document.getElementById("course");
let members = document.getElementById("members");

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
    let data = JSON.parse(e.data);

    room_id.innerText = "";
    course.innerText = "";
    members.innerHTML = "";

    if (data.status !== "success") {
        room_id.innerText = "Offline";
        return;
    }

    room_id.innerText = data.id;
    course.innerText = data.setting.course;
    members.innerHTML += data.members.map(v => {
        return `<li class="member">${v.name}</li>`
    }).join("\n");
}