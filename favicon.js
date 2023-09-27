// @ts-nocheck
const program = require("commander");

const rfg = require("rfg-api").init();
const fs = require("fs");
const { resourceLimits } = require("worker_threads");

program
  .option("-c, --config <file>", "config file (favicon.json)", "favicon.config.json")
  .option("-i, --image <image>", "image to convert (icon.svg)", "icon.svg")
  .option("-o, --output <directory>", "output directory (images)", "images")
  .option("-b, --base <directory>", "base project directory", "");
program.parse();
const options = program.opts();

const config = JSON.parse(fs.readFileSync(options.config));

const opts = {
  apiKey: "402333a17311c9aa68257b9c5fc571276090ee56",
  masterPicture: options.image,
  design: config.design,
  settings: config.settings,
};

const request = rfg.createRequest(opts);

rfg.generateFavicon(request, options.output, function (err, result) {
  if (err) {
    throw err;
  }

  fs.rename(
    `${options.output}/favicon.ico`,
    `${options.base}favicon.ico`,
    function (err) {
      if (err) throw err;
    },
  );
  fs.rename(
    `${options.output}/site.webmanifest`,
    `${options.base}site.webmanifest`,
    function (err) {
      if (err) throw err;
    },
  );
  
  fs.unlink(
    `${options.output}/favicon-16x16.png`,
    function (err) {
      if (err) throw err;
    },
  );

  fs.unlink(
    `${options.output}/favicon-32x32.png`,
    function (err) {
      if (err) throw err;
    },
  );

  console.log("Generation completed");
});
