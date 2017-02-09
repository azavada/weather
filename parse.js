var fs = require('fs');

function parseFile(fileName) {
    fs.readFile(fileName, "utf8", function (err, data) {
        if (err) {
            console.log(err)
        } else {
            process(fileName, data, "avg");
            process(fileName, data, "min");
        }
    });
}

function process(inputFilename, data, key) {
    var parsed = JSON.parse(data);
    var resultString = "year, ";

    for (var i = 10; i >= -30; i--) {
        resultString += i + ", "
    }

    resultString += "\n";

    for (var year in parsed) {
        resultString += year + ", ";

        for (var i = 10; i >= -30; i--) {
            var days = 0;
            for (var month in parsed[year]) {
                for (var day in parsed[year][month]) {
                    var obj = parsed[year][month][day];
                    if (obj[key] <= i) {
                        days++;
                    }
                }
            }

            resultString += days + ", "
        }

        resultString += "\n";
    }

    var outFilename = inputFilename.substr(0, inputFilename.lastIndexOf(".")) + " (" + key + ").csv";
    fs.writeFile(outFilename, resultString, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

parseFile("./data/2005-2017.json");
parseFile("./data/1960-2017.json");