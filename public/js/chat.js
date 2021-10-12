const socket = io()

// elements
const msg_form = document.getElementById('form-message')
const input = document.querySelector('input')
const send_button = document.getElementById('send-button')
const share_button = document.getElementById('share-location')
const messages_container = document.getElementById('messages-container')

// templates
const messageTemplate = document.getElementById('message-template').innerHTML
const urlTemplate = document.getElementById('url-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML

// options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoScroll = () => {
  // new message element
  const newMessage = messages_container.lastElementChild

  // height of the new message
  const newMessageStyles = getComputedStyle(newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin

  // // visible height
  const visibleHeight = messages_container.offsetHeight

  // height of messages_container
  const containerHeight = messages_container.scrollHeight

  // how far have i scrolled
  const scrollOffset = messages_container.scrollTop + visibleHeight
  
  if(containerHeight - newMessageHeight <= scrollOffset){
    messages_container.scrollTop = messages_container.scrollHeight
  }

}

socket.on('message', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
    username: message.username || "",
    message: message.text,
    createdAt: moment(message.createdAt).format("HH:mm:ss")
  })
  messages_container.insertAdjacentHTML('beforeend', html)
  autoScroll()
})

socket.on('locationMessage', (message) => {
  console.log(message)
  const html = Mustache.render(urlTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("HH:mm:ss")
  })
  messages_container.insertAdjacentHTML('beforeend', html)
  autoScroll()
})

socket.on('roomData', ({room, users}) => {
  const html = Mustache.render(sidebarTemplate, {
    room, users
  })
  document.getElementById('sidebar').innerHTML = html
})

input.addEventListener('input', () => {
  if(input.value === ''){
    send_button.disabled = true
    return
  }
  send_button.disabled = false
})

msg_form.addEventListener('submit', (e) => {
  e.preventDefault()
  let message = input.value
  input.value = ''
  input.focus()
  send_button.disabled = true
  socket.emit('sendMessage', message, (error) => {
    if(error){
      return console.log(error)
    }
    console.log('Message was delivered!')
  })
})

share_button.addEventListener('click', () => {
  share_button.disabled = true
  if(!navigator.geolocation){
    share_button.disabled = false
    return alert('Geolocation is not supported by your browser!')
  }
  navigator.geolocation.getCurrentPosition((position) => {
    const {latitude, longitude} = position.coords
    socket.emit('sendLocation', {latitude, longitude}, () => {
      console.log('Your location has been shared')
      share_button.disabled = false
    })
  })
})

socket.emit('join', {username, room}, (error) => {
  if (error){
    alert(error)
    location.href = '/'
  }
})
