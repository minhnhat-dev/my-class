const CreateError = require("http-errors");

let devices = [];
console.log("devices", devices);
function addDevice(input) {
    const { deviceId, socketId } = input;
    if (!deviceId || !socketId) throw new CreateError.BadRequest("error_userId_required");

    const deviceExist = devices.find((device) => device.deviceId === deviceId);

    if (deviceExist) {
        return {
            error: [
                "error_device_id_already_connect"
            ]
        };
    }

    const device = { deviceId, socketId };
    devices.push(device);
    console.log("+ addDevice() devices: ==> ", devices);
    return devices;
}

function getDevice(deviceId) {
    return devices.find((device) => device.deviceId === deviceId);
}

function getDevices() {
    return devices;
}

function removeDevice(socketId) {
    const newDevices = devices.filter((item) => item.socketId !== socketId);
    devices = newDevices;
    console.log(`+ removeDevice() devices: ==> ${devices}`);
    return devices;
}

module.exports = {
    addDevice,
    getDevice,
    getDevices,
    removeDevice
};
