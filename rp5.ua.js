var fs = require('fs');

function F() {
    this.run = function () {

        fs.readFile("./data/rp5.ua.csv", "utf8", function (err, data) {
            if (err) {
                console.log(err)
            } else {
                buildJson(data);
                // console.log(data)
            }
        });
    };

    function parseDateTime(string) {
        var match = string.match(/(\d{2})\.(\d{2})\.(\d{4})\W(\d{2}:\d{2})/);
        if (match && match.length >= 5) {
            return {day: match[1], month: match[2], year: match[3], hour: match[4]}
        }
    }

    function findAverage(array) {
        var total = 0;
        for (var i = 0; i < array.length; i++) {
            total += array[i];
        }
        var average = total / array.length;
        return Math.round(average * 10) / 10;
    }

    function buildJson(data) {
        var obj = {};
        var array = data.split("\n");

        array.forEach(function (entry) {
            var split = entry.split(",");

            if (split.length >= 2) {
                var dateTime = parseDateTime(split[0]);

                var year = dateTime.year;
                var month = formatNum(dateTime.month);
                var day = formatNum(dateTime.day);

                if (typeof obj[year] === "undefined") {
                    obj[year] = {};
                }

                if (typeof obj[year][month] === "undefined") {
                    obj[year][month] = {}
                }

                if (typeof obj[year][month][day] === "undefined") {
                    obj[year][month][day] = {}
                }

                var temp = parseFloat(split[1]);
                if (!isNaN(temp)) {
                    obj[year][month][day][dateTime.hour] = temp;
                }
            }
        });

        for (var year in obj) {
            for (var month in obj[year]) {
                for (var day in obj[year][month]) {

                    var temp = [];
                    for (var hour in obj[year][month][day]) {
                        temp.push(obj[year][month][day][hour]);
                    }

                    var max = Math.max.apply(null, temp);
                    var min = Math.min.apply(null, temp);
                    var avg = findAverage(temp);

                    obj[year][month][day]["max"] = max;
                    obj[year][month][day]["min"] = min;
                    obj[year][month][day]["avg"] = avg;
                }
            }
        }

        fs.writeFile("./data/2005-2017.json", JSON.stringify(obj), function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }

    function formatNum(num) {
        var int = parseInt(num);

        if (!isNaN(int)) {
            if (int < 10) {
                return "0" + int;
            }
        }

        return num;
    }
}

module.exports = new F();
