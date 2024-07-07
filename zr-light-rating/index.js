let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");

let guest_icon = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" class="guest_icon"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M183.1 235.3c33.7 20.7 62.9 48.1 85.8 80.5c7 9.9 13.4 20.3 19.1 31c5.7-10.8 12.1-21.1 19.1-31c22.9-32.4 52.1-59.8 85.8-80.5C437.6 207.8 490.1 192 546 192h9.9c11.1 0 20.1 9 20.1 20.1C576 360.1 456.1 480 308.1 480H288 267.9C119.9 480 0 360.1 0 212.1C0 201 9 192 20.1 192H30c55.9 0 108.4 15.8 153.1 43.3zM301.5 37.6c15.7 16.9 61.1 71.8 84.4 164.6c-38 21.6-71.4 50.8-97.9 85.6c-26.5-34.8-59.9-63.9-97.9-85.6c23.2-92.8 68.6-147.7 84.4-164.6C278 33.9 282.9 32 288 32s10 1.9 13.5 5.6z"/></svg>`

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

    course.innerText = "";
    members.innerHTML = "";

    if (data.status !== "success") {
        course.innerText = "Currently offline";
        members.style.visibility = "hidden";
        return;
    }

    course.style.visibility = "visible";
    members.style.visibility = "visible";
    course.innerText = data.setting.course;
    members.innerHTML = data.members.map(member => {
        switch (data.setting.game_mode) {
            case 0:
                if (member.guest_name !== "")
                    return `<div class="member_root"><div class="member">${member.name}</div><div class="rating">${member.vr} VR</div></div><div class="member_root"><div class="member">${member.guest_name}</div><div class="rating">GUEST</div></div>`
                else
                    return `<div class="member_root"><div class="member">${member.name}</div><div class="rating">${member.vr} VR</div></div>`
            case 1:
            case 2:
                if (member.guest_name !== "")
                    return `<div class="member_root"><div class="member">${member.name}</div><div class="rating">${member.br} BR</div></div><div class="member_root"><div class="member">${member.guest_name}</div><div class="rating">GUEST</div></div>`
                else
                    return `<div class="member_root"><div class="member">${member.name}</div><div class="rating">${member.br} BR</div></div>`
            default:
                return `<div class="member_root"><div class="member">${member.name}</div></div>`
        }
    }).join("\n");
}