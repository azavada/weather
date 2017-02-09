var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

function F() {
    var obj = {};

    this.run = function () {
        for (var year = 1960; year <= 2017; year++) {
            for (var month = 1; month <= 12; month++) {
                doRequest(month, year);
            }
        }
    };

    function formatNum(num) {
        var int = parseInt(num);

        if (!isNaN(int)) {
            if (int < 10) {
                return "0" + int;
            }
        }

        return num;
    }

    function doRequest(month, year) {
        var theMonth = formatNum(month);
        var url = "http://en.tutiempo.net/climate/" + theMonth + "-" + year + "/ws-333930.html";

        request.get(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                var $ = cheerio.load(body);
                var rows = $("table.medias.mensuales > tr");

                rows.each(function (index, row) {
                    var children = cheerio.load(row)("td").toArray();
                    if (children.length >= 4) {
                        var day = cheerio.load(children[0]).root().text();

                        if (!isNaN(parseInt(day))) {
                            var avg = parseFloat(cheerio.load(children[1]).root().text());
                            var max = parseFloat(cheerio.load(children[2]).root().text());
                            var min = parseFloat(cheerio.load(children[3]).root().text());

                            if (!isNaN(avg) || !isNaN(max) || !isNaN(min)) {
                                if (typeof obj[year] === "undefined") {
                                    obj[year] = {};
                                }

                                if (typeof obj[year][theMonth] === "undefined") {
                                    obj[year][theMonth] = {};
                                }

                                var theDay = formatNum(day);
                                obj[year][theMonth][theDay] = {avg: avg, max: max, min: min};
                                console.log("processing " + year + "-" + theMonth + "-" + theDay);
                            }
                        }
                    }
                });

                fs.writeFile("./data/1960-2017.json", JSON.stringify(obj), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        })
    }


}

module.exports = new F();
