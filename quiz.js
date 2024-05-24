var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const speakBtn = document.querySelector("#speakBtn");
const questionBtn = document.querySelector("#questionBtn");
const questionDisplay = document.querySelector("#question");
const output = document.querySelector("#output");
const result = document.querySelector(".result");
const recognition = new SpeechRecognition();

const synth = window.speechSynthesis;
let utterance = new SpeechSynthesisUtterance();
utterance.lang = "en-US";
utterance.pitch = 1;
utterance.rate = 0.85;

recognition.lang = 'en-US';

const quizQuestions = [
  { question: "What is the capital of France?", answer: "Paris", answered: false },
  { question: "Who wrote Romeo and Juliet?", answer: "William Shakespeare", answered: false },
  { question: "Which ocean is the biggest?", answer: "Pacific Ocean", answered: false },
  { question: "What is the capital of Japan?", answer: "Tokyo", answered: false },
  { question: "Who was the first man on the moon?", answer: "Neil Armstrong", answered: false }
];

let answeredQuestions = 0;
let correctAnswers = 0;

synth.onvoiceschanged = () => {
  let voices = synth.getVoices().filter(matchVoiceToLang);
  utterance.voice = voices[1];
}

function matchVoiceToLang(voice) {
  if (voice.lang == utterance.lang) {
    return true;
  }
  return false;
}

function normalizeAnswer(answer) {
  if (!isNaN(answer)) {
    return parseFloat(answer);
  }
  return answer.toLowerCase();
}

questionBtn.addEventListener("click", () => {
  if (answeredQuestions < quizQuestions.length) {
    const randomQuestion = quizQuestions.find(question => !question.answered);
    questionDisplay.innerHTML = randomQuestion.question;

    questionBtn.disabled = true;

    utterance.text = randomQuestion.question;

    synth.speak(utterance);

    utterance.onend = () => {
      speakBtn.disabled = false;
    };
  }
});

speakBtn.addEventListener("click", () => {
  if (answeredQuestions < quizQuestions.length) {
    
    speakBtn.disabled = true;

    console.log("start met luisteren");
    
    recognition.abort();

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript.toLowerCase();
      output.innerHTML += transcript + "<br>";

      const currentQuestion = quizQuestions.find(question => !question.answered);
      
      const normalizedAnswer = normalizeAnswer(currentQuestion.answer);
      const normalizedTranscript = normalizeAnswer(transcript);

      if (normalizedTranscript === normalizedAnswer) {
        result.innerHTML = "<h2>Correct!</h2>";
        correctAnswers++;
      } else {
        result.innerHTML = "<h2>Incorrect. Try again!</h2>";
      }

      
      currentQuestion.answered = true;
      answeredQuestions++;

      if (answeredQuestions === quizQuestions.length) {
        questionDisplay.innerHTML = "<h2>Your score: " + correctAnswers + " out of 5</h2>";
      } else {
        questionBtn.disabled = false;
      }

      speakBtn.disabled = false;
    };

    recognition.start();
  }
});
