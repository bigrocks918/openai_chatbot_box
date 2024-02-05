var md = window.markdownit()
var threadID
const backhost = 'https://d35t7utcge3aan.cloudfront.net'
window.addEventListener('load', event => {
  document.getElementsByClassName('chat-box')[0].style.display = 'block'
})

function postToChatbox (message, itsMe) {
  var messageList = document.getElementById('message-list')

  var scrollToBottom =
    messageList.scrollHeight -
      messageList.scrollTop -
      messageList.clientHeight <
    80

  var lastMessage = messageList.children[messageList.children.length - 1]

  var newMessage = document.createElement('span')
  newMessage.innerHTML = message

  var className

  if (itsMe) {
    className = 'me'
    scrollToBottom = true
  } else {
    className = 'not-me'
  }

  if (lastMessage && lastMessage.classList.contains(className)) {
    temp_mes_sub_block =
      lastMessage.getElementsByClassName('message-subblock')[0]
    temp_mes_sub_block.appendChild(document.createElement('br'))
    temp_mes_sub_block.appendChild(newMessage)
  } else {
    var messageBlock = document.createElement('div')

    var messageSubblock = document.createElement('div')
    messageSubblock.classList.add('message-subblock')
    messageSubblock.appendChild(newMessage)

    messageBlock.classList.add(className)

    if (className == 'not-me') {
      // Create an image element
      var avatarElement = document.createElement('img')

      // Set the src attribute with the URL of the image
      avatarElement.src =
        'https://testautomatedabiiltyai.s3.eu-north-1.amazonaws.com/ausnewhomecare_logo.png'

      // Set any additional attributes if needed
      avatarElement.alt = 'AusNew Home Care Logo'
      avatarElement.width = 30 // Set the width (optional)
      avatarElement.height = 30 // Set the height (optional)
      avatarElement.classList.add('message-avatar')
      avatarElement.draggable = false

      var avatarSubblock = document.createElement('div')
      avatarSubblock.classList.add('avatar-subblock')
      avatarSubblock.appendChild(avatarElement)
      messageBlock.appendChild(avatarSubblock)
    }

    messageBlock.appendChild(messageSubblock)
    messageList.appendChild(messageBlock)
  }

  if (scrollToBottom) messageList.scrollTop = messageList.scrollHeight
}

var message = document.getElementById('message-input')
message.addEventListener('keypress', function (event) {
  let new_msg = this.value.trim()
  var key = event.which || event.keyCode
  if (key === 13 && new_msg !== '') {
    postToChatbox(new_msg, true)
    this.value = ''
    this.disabled = 'true'
    setTimeout(() => {
      document.getElementsByClassName('typing-spinner')[0].style.display =
        'flex'
      fetch(backhost + '/chatx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ thread_id: threadID, message: new_msg })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          assist_msg = data.response
          setTimeout(() => {
            document.getElementsByClassName('typing-spinner')[0].style.display =
              'none'
            document.getElementById('message-input').disabled = false
            postToChatbox(md.render(assist_msg), false)
            document.getElementById('message-input').focus()
          }, 10000)
          return data.threadID
        })
        .catch(error => {
          document.getElementsByClassName('typing-spinner')[0].style.display =
            'none'
          document.getElementById('message-input').disabled = false
          postToChatbox(error, false)
          document.getElementById('message-input').focus()
        })
    }, 5000)
  }
})

var messageSendButton = document.getElementsByClassName(
  'message-send-button'
)[0]
messageSendButton.addEventListener('click', function (event) {
  let new_msg = message.value.trim()
  if (new_msg != '') {
    postToChatbox(new_msg, true)
    message.value = ''
    document.getElementById('message-input').disabled = true
    setTimeout(() => {
      document.getElementsByClassName('typing-spinner')[0].style.display =
        'flex'
      fetch(backhost + '/chatx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ thread_id: threadID, message: new_msg })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          assist_msg = data.response
          setTimeout(() => {
            document.getElementsByClassName('typing-spinner')[0].style.display =
              'none'
            document.getElementById('message-input').disabled = false
            postToChatbox(md.render(assist_msg), false)
            document.getElementById('message-input').focus()
          }, 10000)
          return data.threadID
        })
        .catch(error => {
          document.getElementsByClassName('typing-spinner')[0].style.display =
            'none'
          document.getElementById('message-input').disabled = false
          postToChatbox(error, false)
          document.getElementById('message-input').focus()
        })
    }, 5000)
  }
})

var end_conv = document.getElementsByClassName('end-conversation')[0]
end_conv.addEventListener('click', function (event) {
  message.value = ''
  document.getElementsByClassName('typing-spinner')[0].style.display = 'flex'
  document.getElementById('message-input').disabled = true
  document.getElementsByClassName(
    'more-menu-dropdown-content'
  )[0].style.display = 'none'

  fetch(backhost + '/chatx', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      thread_id: threadID,
      message:
        'I finished everyting I want so I pressed End Conversation button. Say farewell to me and say you hope to talk with me again soon.'
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(data => {
      document.getElementsByClassName('typing-spinner')[0].style.display =
        'none'
      assist_msg = data.response
      postToChatbox(md.render(assist_msg), false)
      return data.threadID
    })
    .catch(error => {
      document.getElementsByClassName('typing-spinner')[0].style.display =
        'none'
      document.getElementById('message-input').disabled = false
      postToChatbox(error, false)
      document.getElementById('message-input').focus()
    })
})

var dropdown_btn = document.getElementsByClassName('more-menu-dropbtn')[0]
var menu = document.getElementsByClassName('more-menu-dropdown-content')[0]

dropdown_btn.addEventListener('click', function (event) {
  let status = window.getComputedStyle(menu).display
  menu.style.display = status == 'block' ? 'none' : 'block'
})

// Add a click event listener to the document
document.addEventListener('click', function (event) {
  // Get the clicked element
  var target = event.target

  // Check if the clicked element is outside the menu and the button
  if (!menu.contains(target) && !dropdown_btn.contains(target)) {
    menu.style.display = 'none'
  }
})

function initChat () {
  // Send first Hi message from model
  document.getElementsByClassName('typing-spinner')[0].style.display = 'flex'
  document.getElementById('message-input').disabled = true
  fetch(backhost + '/startx')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(data => {
      document.getElementsByClassName('typing-spinner')[0].style.display =
        'none'
      document.getElementById('message-input').disabled = false
      assist_msg = data.assistant_message
      postToChatbox(
        '<img src="https://testautomatedabiiltyai.s3.eu-north-1.amazonaws.com/ausnewhomecare.png" height="60" alt="AusNew Home Care logo">',
        false
      )
      postToChatbox(md.render(assist_msg), false)
      document.getElementById('message-input').focus()
      threadID = data.thread_id
    })
    .catch(error => {
      document.getElementsByClassName('typing-spinner')[0].style.display =
        'none'
      document.getElementById('message-input').disabled = false
      postToChatbox(error, false)
      document.getElementById('message-input').focus()
    })
}

// reserved for future use /////////////////////////////////////////////////////////
function getThreadID () {
  let threadID = localStorage.getItem('assist_thread_id')
  if (!threadID) {
    threadID = initChat()
    localStorage.setItem('assist_thread_id', threadID)
  }
  return threadID
}
// END OF reserved for future use //////////////////////////////////////////////////

initChat()
