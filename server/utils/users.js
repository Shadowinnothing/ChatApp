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

  getUserList(_room){
    let _users = this.users.filter((user) => user.room === _room);
    let namesArray = _users.map((user) => user.name);
    return namesArray;
  }
}

module.exports = {Users};
