const moment = require('moment');

//new Date().getTime();
let timestamp = moment().valueOf();
console.log(timestamp)

let createdAt = 69696969;
let now = moment(createdAt);

console.log(now.format('h:mm a'));
