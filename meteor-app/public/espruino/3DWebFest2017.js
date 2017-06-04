function getMPU() {
    I2C1.setup({scl:B6,sda:B7, bitrate: 100000});

    var MPU6050 = require("MPU6050");
    console.log(MPU6050);

    var mpu = MPU6050.connect(I2C1);

    return mpu
}

function connectToWifi(wifiName, options) {
    var resolve, reject
    var promise = new Promise(function(res, rej) {resolve = res; reject = rej})

    var wifi = require("EspruinoWiFi");

    wifi.connect(wifiName, options, function(err) {
        if (err) reject(err);
        resolve();
    });

    return promise
}

connectToWifi("CenturyLink6344", { password : "zpx2psajg7xqat" })
.then(function() {
    const mpu = getMPU();
    //const dmp = require('MPU6050_DMP').create(mpu, 3);
    const http = require("http");

    //let dmpYawPitchRoll = null

    // This loop locks up the espruino: https://github.com/espruino/EspruinoDocs/issues/367
    //function dmpLoop() {
        //const dmpData = dmp.getData()
        //if (dmpData !== undefined) console.log(dmpYawPitchRoll = dmp.getYawPitchRoll(dmpData))
    //}
    //setWatch(dmpLoop, B5, { repeat:true, edge:'rising' });

    http.createServer(function (req, res) {
        res.writeHead(200);
        let result = {
            acceleration: mpu.getAcceleration(), // returns an [x,y,z] array with raw accl. data
            gravity: mpu.getGravity(),  // returns acceleration array in G's
            rotation: mpu.getRotation(), // returns an [x,y,z] array with raw gyro data
            degreesPerSecond: mpu.getDegreesPerSecond(), // returns gyro array in degrees/s
        }
        result = JSON.stringify(result)
        res.end(result);

        // This never works, it only seems to work in the above loop that locks up espruino.
        //const dmpData = dmp.getData()
        //if (dmpData !== undefined) dmpYawPitchRoll = dmp.getYawPitchRoll(dmpData)
        //console.log(' ------ dmpYawPitchRoll:', dmpYawPitchRoll)

    }).listen(80);

    const wifi = require("EspruinoWiFi");
    wifi.getIP(function(err, info) {
        if (err) throw err

        console.log('IP:', info.ip)
    });
});

function onInit() {
    console.log('Espruino started!');
}
