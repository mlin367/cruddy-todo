const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    // items[id] = text;
    exports.id = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(exports.id, text, (err) => {
      if (err) {
        console.log('Error');
      } else {
        callback(null, {id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  var data = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('Error');
    } else {
      _.each(files, (text, id) => {
        data.push({id: text.slice(0, 5), text: text.slice(0, 5)});
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  fs.readFile(exports.id, (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: text.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, oldText) => {
    if (err) {
      callback(err, {id, text});
    } else {
      fs.writeFile(exports.id, text, err => {
        if (err) {
          console.log('error');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, oldText) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(exports.id, err => {
        if (err) {
          console.log('error');
        } else {
          callback();
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
