const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
  // clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  //validate the data
  if(!room || !username){
    return {
      error: 'Username and room are false'
    }
  }

  // check for existing user
  const existingUser = users.find(user => {
    return user.room === room && user.username === username
  })

  // validate username
  if(existingUser){
    return {
      error: 'Username is already in use!'
    }
  }

  // Store user
  const user = {id, username, room}
  users.push(user)
  return {user}

}

const removeUser = (id) => {
  const index = users.findIndex(user => user.id === id)
  if(index !== -1){
    return users.splice(index, 1)[0]
  }
}

const getUser = (id) => {
  const user = users.find(user => user.id === id)
  return user
}

const getUsersInRoom = (room) => {
  const usersInRoom = users.filter(user => user.room === room)
  return usersInRoom
}

// addUser({
//   id: 1,
//   username: 'Furkan',
//   room: '1'
// })

// addUser({
//   id: 2,
//   username: 'Ibrahim',
//   room: '2'
// })

// addUser({
//   id: 4,
//   username: 'Ozcelik',
//   room: '1'
// })

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
}
