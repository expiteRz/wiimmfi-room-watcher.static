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
        course.style.visibility = "hidden";
        members.style.visibility = "hidden";
        return;
    }

    course.style.visibility = "visible";
    members.style.visibility = "visible";
    room_id.innerText = data.id;
    course.innerText = data.setting.course;
    members.innerHTML += data.members.map(v => {
        let s = `<li class="member">${v.name}</li>`;
        if (v["guest_name"]) {
            s += `\n<li class="member">${v["guest_name"]}</li>`
        }
        return s
    }).join("\n");
}