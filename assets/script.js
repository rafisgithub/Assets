import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element){
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if(element.textContent === '....'){
      element.textContent = '';
    }
  },300)

}

function typeText(element, text){
  let index = 0;
  let interval = setInterval(()=>{
    if(index<text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;

}

function chatStripe (isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
      <div class = "profile">
       <img 
       src="${isAi? bot :user}" 
       alt="${isAi ? 'bot' : 'user'}"
       />
      </div>
      <div class = "message" id= ${uniqueId}> ${value} </div>
      </div>
    </div>

    `
  )
}

const handleSubmit = async (e) =>{
  e.preventDefault();
  const data = new FormData(form);

  //user's chatStrike
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    
  form.reset();

  //bot's chatStrike
  const uniqueId = generateUniqueId();
chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

chatContainer.scrollTop = chatContainer.scrollHeight;
const messageDiv = document.getElementById(uniqueId);

loader(messageDiv);

//fetch data from server ->bot's response
// const response = await fetch ('https://einstein-i0hi.onrender.com' this is my url
const response = await fetch ('http://localhost:5000/', {
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    prompt: data.get('prompt')
  })
});

clearInterval(loadInterval);
messageDiv.innerHTML = '';

if(response.ok) {
  const data = await response.json();
 const parsedData = data.bot.trim();
 typeText(messageDiv, parsedData);
}else{
  const err = await response.text();
  messageDiv.innerHTML = "Something went wrong";
  alert(err);
}

}

form.addEventListener('submit', handleSubmit);

form.addEventListener('keyup', (e) =>{
  if(e.keyCode === 13) {
    handleSubmit(e);
  }

});

//for recognise voice command

// const microphoneButton = document.getElementById('microphone_button');
// const promptTextarea = document.getElementById('prompt');
// const changeLanguage = document.getElementById('change');

// const recognition = new webkitSpeechRecognition();
// recognition.continuous = false;
// recognition.lang = 'en-US'; // English (US)
//  recognition.lang ='bn-BD'; //Bangladesh

const microphoneButton = document.getElementById('microphone_button');
const promptTextarea = document.getElementById('prompt');
const changeLanguage = document.getElementById('change');

let recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US'; // English (US)


changeLanguage.onclick = function() {
  if (recognition.lang === 'en-US') {
    recognition.lang = 'bn-BD'; // Bangla
  } else {
    recognition.lang = 'en-US'; // English (US)
  }
}

microphoneButton.addEventListener('click', () => {
  promptTextarea.value = "Hey there, I'm listening...";
  recognition.start();
});

recognition.onresult = function(event) {
  const result = event.results[0][0].transcript;
  promptTextarea.value = result;
}

recognition.onerror = function(event) {
  console.error(event);
}

recognition.onend = function() {
  console.log('Speech recognition ended.');
}


// const readButton = document.getElementById('read_button');
// const messageDiv = document.getElementById('chat_container');

// readButton.addEventListener('click', () => {
//   const message = messageDiv.textContent.trim();
//   if (message !== '') {
//     const speech = new SpeechSynthesisUtterance();
//     speech.text = message;
//     speech.voice = speechSynthesis.getVoices().find((voice) => voice.name === 'Google UK English Female' && voice.gender === 'female');

//     speech.pitch = 1;
//     speech.rate = 0.9;
//     window.speechSynthesis.speak(speech);
//   }
// });

//for loudly read the message
// const readButton = document.getElementById('read_button');
// const messageDiv = document.getElementById('chat_container');

// readButton.addEventListener('click', () => {
//   const message = messageDiv.textContent.trim();
//   if (message !== '') {
//     const speech = new SpeechSynthesisUtterance();
//     speech.text = message;

//     // Filter the available voices to find a female voice with the name 'Google UK English Female'
//     const femaleVoice = speechSynthesis.getVoices().find((voice) => voice.name === 'Google UK English Female' && voice.lang === 'en-GB');
//     if (femaleVoice) {
//       speech.voice = femaleVoice;
//     } else {
//       console.warn('Female voice not found.');
//     }

//     speech.pitch = 1;
//     speech.rate = 0.9;
//     window.speechSynthesis.speak(speech);
//   }
// });

//all about read message function
// const readButton = document.getElementById('read_button');
// const stopButton = document.getElementById('stop_reading');
// const messageDiv = document.getElementById('chat_container');
// let speech = null; // Declare speech variable outside event listeners
//
// readButton.addEventListener('click', () => {
//   const message = messageDiv.textContent.trim();
//   if (message !== '') {
//     speech = new SpeechSynthesisUtterance();
//     speech.text = message;
//
//     const femaleVoice = speechSynthesis.getVoices().find((voice) => voice.name === 'Google UK English Female' && voice.lang === 'en-GB');
//     if (femaleVoice) {
//       speech.voice = femaleVoice;
//     } else {
//       console.warn('Female voice not found.');
//     }
//
//     speech.pitch = 1;
//     speech.rate = 0.9;
//     window.speechSynthesis.speak(speech);
//   }
// });
// //stop reading
// stopButton.addEventListener('click', () => {
//   if (speech) {
//     window.speechSynthesis.cancel();
//   }
// });

const readButton = document.getElementById('read_button');
const stopButton = document.getElementById('stop_reading');
const messageDiv = document.getElementById('chat_container');
let speech = null;

readButton.addEventListener('click', () => {
  const message = messageDiv.textContent.trim();
  if (message !== '') {
    speech = new SpeechSynthesisUtterance();
    speech.text = message;

    const lang = messageDiv.getAttribute('lang');
    const voice = selectVoice(lang);
    if (voice) {
      speech.voice = voice;
    } else {
      console.warn(`Voice not found for language: ${lang}`);
    }

    speech.pitch = 1;
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  }
});

stopButton.addEventListener('click', () => {
  if (speech) {
    window.speechSynthesis.cancel();
  }
});

function selectVoice(lang) {
  const availableVoices = speechSynthesis.getVoices();
  if (lang === 'bn') {
    // Find a Bengali voice
    // return availableVoices.find((voice) => voice.name === 'Google বাংলা');
    return availableVoices.find((voice) => voice.lang === 'bn-BD');
  } else {
    // Find an English voice
    return availableVoices.find((voice) => voice.name === 'Google US English Female' && voice.lang === 'en-US');
  }
}


