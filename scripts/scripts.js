function createCar(color = 'red', consumption = 2.4, tankVolume = 60) {
    let _tankVolume = tankVolume;
    let _consumption = consumption;
    let _startInterval;
    let speed;
    let distance;
    let finalConsumption;
    let speedConsumption;

    function _checkGasInput(isFull, gasVolume) {
        if (typeof isFull !== 'boolean') {
            console.warn('isFull addGas function parameter must be a Boolean');
            return false;
        }
        if (!isFull && !_isNumber(gasVolume)) {
            console.warn('gasVolume addGas function parameter must be a Number');
            return false;
        }
        return true;
    }

    function _isNumber(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }

    function _checkGasVolume(gasVolume) {
        return (car.gasVolume + gasVolume) < _tankVolume && (car.gasVolume + gasVolume) >= 0
    }

    function _checkGasExisting() {
        if (car.gasVolume >= 0) {
            return true
        } else {
            console.warn('Fuel not found');
        }
    }

    function _checkIgnition() {
        if (car.ignition === true) {
            console.log('Ignition already start');
            return true;
        }
    }

    function _carIgnition() {
        if (_checkIgnition()) {
            return
        } else {
            car.ignition = true;
        }
    }

    function _ride() {
        _carIgnition();
        speedConsumption = (speed * _consumption) / 50;
        finalConsumption = (distance * speedConsumption) / 100
        _startInterval = setInterval(function () {
            if (car.gasVolume.toFixed(2) > 0) {
                if (_checkGasExisting() && finalConsumption) {
                    car.gasVolume -= finalConsumption;
                } else {
                    car.stop();
                    console.warn('You are looser');
                }
            } else {
                clearInterval(_startInterval);
                console.log(`Fuel run out, you passed ${distance} kilometers, you was been driving at a speed of ${speed} kilometers p/h, your fuel consumption was ${finalConsumption} liters p/s, you have ${car.gasVolume + finalConsumption} liters of gasoline`);
            }
        }, 1000)
    }
    let car = {
        color: color,
        gasVolume: 0,
        ignition: false,
        checkGas() {
            return car.gasVolume.toFixed(2);
        },
        addGas(isFull = false, gasVolume = 0) {
            if (!_checkGasInput(isFull, gasVolume)) {
                return;
            }
            if (isFull) {
                car.gasVolume = _tankVolume;
            } else {
                if (_checkGasVolume()) {
                    car.gasVolume += gasVolume;
                } else {
                    console.warn(`Gas volume is too large. You can add only ${_tankVolume - car.gasVolume}`);
                }
            }
        },
        start() {
            _carIgnition();
            _startInterval = setInterval(function () {
                if (_checkGasExisting() && !finalConsumption) {
                    car.gasVolume -= _consumption;;
                } else {
                    car.stop();
                    console.warn('You are looser');
                }
            }, 1000)
        },
        stop() {
            car.ignition = false;
            clearInterval(_startInterval);
        },
        ride(distanceCar, speedCar) {
            if ('number' !== typeof speedCar || 'number' !== typeof distanceCar) {
                return console.log('Distance and speed must be number!');
            }
            speed = speedCar;
            distance = distanceCar;
            _ride()
        },
        stopRide() {
            car.ignition = false;
            console.log(`Ride car, you passed ${distance} kilometers, you was driving at a speed of ${speed} kilometers p/h, your fuel consumption was ${finalConsumption} liters p/s, you have ${car.gasVolume + finalConsumption} liters of gasoline`);
            clearInterval(_startInterval);
        },
    }
    return car;
}