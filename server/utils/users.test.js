const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {

  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Adam',
      room: 'Node'
    }, {
      id: '2',
      name: 'Kevin',
      room: 'React'
    }, {
      id: '3',
      name: 'Mike',
      room: 'Node'
    }];
  });

  it('should add a user', () => {
    let users = new Users();
    const user = {id: '12', name: 'Ryan', room: 'Room'}
    const res = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should return names for Node course', () => {
    let userList = users.getUserList('Node');

    expect(userList).toEqual(['Adam', 'Mike']);
  });

  it('should return names for React course', () => {
    let userList = users.getUserList('React');

    expect(userList).toEqual(['Kevin']);
  });

  it('should remove a user', () => {
    let userToRemove = users.users[1];
    let removedUser = users.removeUser('2');

    expect(users.users.length).toEqual(2);
    expect(removedUser).toEqual(userToRemove);
  });

  it('should not remove user', () => {
    let removedUser = users.removeUser('69');

    expect(removedUser).toEqual(null);
    expect(users.users.length).toEqual(3);
  });

  it('should find user by id', () => {
    let user = users.getUser('2');

    expect(user).toBe(users.users[1]);
  });

  it('should not find user by id', () => {
    let user = users.getUser('69');

    expect(user).toNotExist();
  });

  it('should find a user by name', () => {
    let user = users.getUserName('Mike');

    expect(user.name).toEqual('Mike');
  });

  it('should not find a user by name if name doesnt exist', () => {
    let user = users.getUserName('Aaron Rodgers');
    
    expect(user).toBeFalsy();
  });

});
