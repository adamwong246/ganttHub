var mongoose = require("mongoose");
var passport = require("passport");
var JSZip = require("jszip");
const fs = require('fs');
const react = require("react");
const ReactDOMServer = require('react-dom/server');
const puppeteer = require('puppeteer');

const Template = require("../example.js");

var User = require("../models/User");
const fakeData = require("../fakeResponse.json")

var labelizerController = {};

const browser = puppeteer.launch({
  executablePath: '/opt/homebrew/bin/chromium',
})

const runIt = async (interations, batch, zip) => {
  for (let ndx = 0; ndx < interations; ndx++) {
    console.log(`${ndx} / ${interations}`)

    const htmlContent = ReactDOMServer.renderToStaticMarkup(
      react.createElement(Template, { toWhat: "adam", batch, iteration: ndx })
    );

    zip.file(`${ndx}.html`, htmlContent)

    await browser.then((b) => b.newPage())
      .then((page) => {
        page.setContent(htmlContent)
        return page
      })
      .then((page) => {
        return {
          screenshot: page.screenshot()
          .then((jpeg) => zip.file(`${ndx}.jpeg`, jpeg)),
          page
        }
      })
      .then(({page}) => page.pdf({
        path: '/dev/null',
        width: "3.81 in",
        height: "6 in",
        "printBackground": false,
        "margin": {
          "top": "0.4in",
          "right": "0.4in",
          "bottom": "0.4in",
          "left": "0.4in"
        }
      }))
      .then((pdf) => zip.file(`${ndx}.pdf`, pdf))
  }
  return zip
};

// Restrict access to root page
labelizerController.labelize = function (req, res) {

  const labelString = 'ABCDEF012345670000000002';
  const batch = fakeData.find((batch) => batch.Label === labelString)

  if (!batch) {
    console.error("that label didn't match any results!");
    process.exit(-1);
  }

  const iterationsString = "100";
  const interations = Number.parseInt(iterationsString);

  new Promise((resolve, reject) => {
    resolve(new JSZip())
  })
  .then((zip) => {
    return runIt(interations, batch, zip)
  })
  .then((zip) => zip.generateAsync({ type: "uint8array" }))
  .then((zipData) => {
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="theLabels.zip"`,
      'Content-Type': 'application/zip',
    })

    res.end(Buffer.from(zipData, 'base64'))
  });

};

module.exports = labelizerController;