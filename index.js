var Q = require("q");
var Base = require('mocha/lib/reporters/base')
  , color = Base.color;
var fs = require("fs");

function MochaWdScreenshotReporter(runner) {
    var dir = "failure-screenshots";
    fs.existsSync(dir) || fs.mkdirSync(dir);
    Base.call(this, runner);
    var self = this;

    runner.on('fail', function(test, err) {
        // mop: REALLY hacky :S
        if (err && err.browser) {
            // mop: its not synchronized :( did not yet find a way (not even a hackish) to prevent mocha from continuing even though
            // the screenshot might not yet be ready
            err.browser.takeScreenshot().then(function(result) {
                var fd = fs.openSync(dir + "/" + test.title.replace(/[^a-zA-Z0-9-_]/g, "-") + ".png", "w+");
                var buf = new Buffer(result, "base64");
                fs.writeSync(fd, buf, 0, buf.length);
            });
        }
    });
}

exports = module.exports = MochaWdScreenshotReporter;
