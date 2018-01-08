const createRoomId = (length = 4) => {
    // RoomIds will be composed of [A-Z] and/or [0-9].
    const baseAscii = 65;
    let id = '';

    for (var i = 0; i < length; i++) {
        let rand = Math.trunc(Math.random() * 36) + 65;
        if (rand > 90) {
            rand = 47 + (rand - 90);
        }

        id += String.fromCharCode(rand);
    }

    return id;
};

module.exports = {
    createRoomId,
};