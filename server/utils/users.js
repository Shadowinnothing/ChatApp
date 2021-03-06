const _ = require('lodash');

class Users {
  constructor(){
    this.users = []
  }

  addUser(id, name, room){
    const user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser(_id){
    let removedUser = this.getUser(_id);
    if(removedUser){
      this.users = this.users.filter((user) => user.id !== _id);
    }

    return removedUser;
  }

  getUser(_id){
    return this.users.filter((user) => user.id === _id)[0];
  }

  getUserName(_name){
    return this.users.filter((user) => user.name === _name)[0];
  }

  getUserList(_room){
    let _users = this.users.filter((user) => user.room === _room);
    let namesArray = _users.map((user) => user.name);
    return namesArray;
  }

  getRoomList(){
    let rooms = this.users.map((user) => user.room);
    return _.uniq(rooms);
  }
}

module.exports = {Users};
