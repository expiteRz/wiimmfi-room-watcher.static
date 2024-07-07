let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");

let preview = document.getElementById("canvas"),
    course_img = document.getElementById("course-img"),
    trackname = document.getElementById("trackname");
let preserved_bg_id, url;

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

course_img.addEventListener("load", () => {
    preview.style.backgroundImage = `url(${url})`;
    preview.style.backgroundPosition = "center";
})
course_img.addEventListener("error", () => {
    preview.style.backgroundImage = "url(unknown.png)";
    preview.style.backgroundPosition = "center";
})

socket.onmessage = e => {
    let data = JSON.parse(e.data);

    if (data.setting.course_id === preserved_bg_id || data.setting.course_id === 0) return;
    preserved_bg_id = data.setting.course_id;

    url = data.setting.thumbnail_url;
    course_img.src = data.setting.thumbnail_url;

    trackname.innerText = data.setting.course;
}
