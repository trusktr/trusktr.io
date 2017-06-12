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

function getIP() {
    const wifi = require("EspruinoWiFi");
    wifi.getIP(function(err, info) {
        if (err) {
            console.log('Wifi connection failed, trying again in a sec...')
            setTimeout(getIP, 1000)
        }
        console.log('IP:', info.ip)
    });
}

connectToWifi("starlancer", { password : "Next stop: Mars." })
.then(function() {
    getIP();

    //////////////////////////////////////////////////////////////////////////////////
    //const dmp = require('MPU6050_DMP').create(mpu, 3);
    //let dmpYawPitchRoll = null
    //// This loop locks up the espruino: https://github.com/espruino/EspruinoDocs/issues/367
    //function dmpLoop() {
        //const dmpData = dmp.getData()
        //if (dmpData !== undefined) {
            ////console.log(
                //dmpYawPitchRoll = dmp.getYawPitchRoll(dmpData)
            ////)
        //}
    //}
    //setWatch(dmpLoop, B5, { repeat:true, edge:'falling' });

    //const http = require("http");
    //http.createServer(function (req, res) {
        //const mpu = getMPU();
        //res.writeHead(200);
        //let result = {
            //acceleration: mpu.getAcceleration(), // returns an [x,y,z] array with raw accl. data
            //gravity: mpu.getGravity(),  // returns acceleration array in G's
            //rotation: mpu.getRotation(), // returns an [x,y,z] array with raw gyro data
            //degreesPerSecond: mpu.getDegreesPerSecond(), // returns gyro array in degrees/s
        //}
        //result = JSON.stringify(result)
        //res.end(result);

        //// This never fires
        ////console.log(' ------ dmpYawPitchRoll:', dmpYawPitchRoll)

    //}).listen(80);

    //////////////////////////////////////////////////////////////////////////////////
    var server = require('ws').createServer(function() {});

    server.listen(80);
    server.on("websocket", function(ws) {
        ws.on('message', function(msg) {
            print("[WS] "+JSON.stringify(msg));
        });
        const mpu = getMPU();
        setInterval(function() {
            let result = {
                //acceleration: mpu.getAcceleration(), // returns an [x,y,z] array with raw accl. data
                acceleration: mpu.getGravity(),  // returns acceleration array in G's
                //rotation: mpu.getRotation(), // returns an [x,y,z] array with raw gyro data
                rotation: mpu.getDegreesPerSecond(), // returns gyro array in degrees/s
            }
            result = JSON.stringify(result)
            console.log(result)
            ws.send(result);
        }, 40);
    });

});

function onInit() {
    console.log('Espruino started!');
}
