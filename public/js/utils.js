function Utils() {}
Utils.prototype = {};
Utils.prototype.readTextFile = (file, callback) => {
  let rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
};

Utils.prototype.runTime = async (callback) => {
  let start = new Date();
  await callback;
  await Utils.prototype.console(new Date() - start + "ms");
};

Utils.prototype.console = (message) => {
  console.log(message);
};

const utils = new Utils();
