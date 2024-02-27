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
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "Who wrote Romeo and Juliet?", answer: "William Shakespeare" },
  { question: "Which ocean is the biggest?", answer: "Pacific Ocean" },
  { question: "What is the capital of Japan?", answer: "Tokyo" },
  { question: "Who was the first man on the moon?", answer: "Neil Armstrong"}
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

    // Disable the question button while the question is being asked
    questionBtn.disabled = true;

    // Set the text of the utterance to the question
    utterance.text = randomQuestion.question;

    // Speak the question
    synth.speak(utterance);

    utterance.onend = () => {
      // Enable the speak button once the utterance has finished playing
      questionBtn.disabled = false;
      speakBtn.disabled = false;
    };
  }
});

speakBtn.addEventListener("click", () => {
  if (answeredQuestions < quizQuestions.length) {
    // Disable the speak button while listening
    speakBtn.disabled = true;

    console.log("start met luisteren");
    // Reset recognition instance
    recognition.abort();

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript.toLowerCase();
      output.innerHTML += transcript + "<br>";

      // Check if the answer is correct (case-insensitive)
      const normalizedAnswer = normalizeAnswer(quizQuestions[answeredQuestions].answer);
      const normalizedTranscript = normalizeAnswer(transcript);

      if (normalizedTranscript === normalizedAnswer) {
        result.innerHTML = "<h2>Correct!</h2>";
        correctAnswers++;

        // Move to the next question
        answeredQuestions++;

        // Check if all questions are answered
        if (answeredQuestions === quizQuestions.length) {
          questionDisplay.innerHTML = "<h2>Your score: " + correctAnswers + " out of 5</h2>";
        } else {
          // Display the next question
          const nextQuestion = quizQuestions[answeredQuestions].question;
          questionDisplay.innerHTML = nextQuestion;

          // Set the text of the utterance to the next question
          utterance.text = nextQuestion;

          // Speak the next question
          synth.speak(utterance);
        }
      } else {
        result.innerHTML = "<h2>Incorrect. Try again!</h2>";
      }

      speakBtn.disabled = false; // Enable the speak button for the next question
    };

    recognition.start();
  }
});
