document.addEventListener('DOMContentLoaded', () => {
  // Mock Quiz State
  let selectedOptionIndex = null;
  let isSubmitted = false;
  let isSolved = false;
  let countdownInterval = null;

  // DOM Elements - Quiz
  const optionItems = document.querySelectorAll('.option-item');
  const btnSubmit = document.getElementById('quiz-submit-btn');
  const feedbackBox = document.getElementById('quiz-feedback');
  const feedbackText = document.getElementById('feedback-text');
  const questionCard = document.querySelector('.question-card');
  const unlockBanner = document.getElementById('unlock-banner');
  const toastCountdown = document.getElementById('toast-countdown');
  const btnReset = document.getElementById('demo-reset-btn');

  // DOM Elements - Audio Player Simulation
  const audioPlayBtn = document.getElementById('audio-play-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const timelineFill = document.getElementById('timeline-fill');
  const timeCurrent = document.getElementById('time-current');
  
  let isAudioPlaying = false;
  let audioProgress = 0; // percentage
  let audioTimerId = null;
  const audioDurationSecs = 105; // 1:45

  // 1. Option Selection Handler
  optionItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (isSolved) return; // Locked once successfully solved

      // Reset feedback styling from previous attempt
      questionCard.classList.remove('incorrect-card');
      optionItems.forEach(opt => opt.classList.remove('incorrect'));
      feedbackBox.classList.remove('show', 'incorrect', 'correct');

      // Update selection
      optionItems.forEach(opt => opt.classList.remove('selected'));
      item.classList.add('selected');
      selectedOptionIndex = index;
      
      // Enable submit button
      btnSubmit.removeAttribute('disabled');
    });
  });

  // 2. Submit Handler
  btnSubmit.addEventListener('click', () => {
    if (selectedOptionIndex === null || isSolved) return;

    isSubmitted = true;
    const correctOptionIndex = 1; // Option B is correct ("To request a change in delivery schedules")

    if (selectedOptionIndex === correctOptionIndex) {
      // SUCCESS STATE
      isSolved = true;
      questionCard.classList.add('correct-card');
      optionItems[selectedOptionIndex].classList.add('correct');
      
      // Show correct feedback
      feedbackBox.className = 'quiz-feedback-box show correct';
      feedbackText.innerHTML = `<strong>Correct!</strong> 15 minutes of browsing credits earned.`;
      
      // Hide submit button and show unblocked banner
      btnSubmit.style.display = 'none';

      // Trigger "Bypass Unlocked" extension simulation banner
      showUnlockToast();
    } else {
      // ERROR / INCORRECT STATE
      questionCard.classList.add('incorrect-card');
      optionItems[selectedOptionIndex].classList.add('incorrect');
      
      // Show incorrect feedback
      feedbackBox.className = 'quiz-feedback-box show incorrect';
      feedbackText.innerHTML = `<strong>Incorrect.</strong> Read the passage again and try another option.`;
      
      // Disable submit button until a new option is chosen
      btnSubmit.setAttribute('disabled', 'true');
    }
  });

  // 3. Simulated Toast Trigger
  function showUnlockToast() {
    unlockBanner.style.display = 'block';
    
    // Simulate countdown from 15m remaining
    let minsLeft = 15;
    let secsLeft = 0;
    
    countdownInterval = setInterval(() => {
      if (secsLeft === 0) {
        if (minsLeft === 0) {
          clearInterval(countdownInterval);
          return;
        }
        minsLeft--;
        secsLeft = 59;
      } else {
        secsLeft--;
      }
      toastCountdown.textContent = `${minsLeft}:${secsLeft.toString().padStart(2, '0')}`;
    }, 1000);
  }

  // 4. Audio Voiceover Player Simulator
  audioPlayBtn.addEventListener('click', () => {
    if (isAudioPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });

  function playAudio() {
    isAudioPlaying = true;
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';

    audioTimerId = setInterval(() => {
      audioProgress += 0.5; // slow advancement
      if (audioProgress >= 100) {
        audioProgress = 100;
        pauseAudio();
        audioProgress = 0;
      }
      timelineFill.style.width = `${audioProgress}%`;
      
      // Calculate simulated current time
      const currentSecs = Math.floor((audioProgress / 100) * audioDurationSecs);
      const m = Math.floor(currentSecs / 60);
      const s = currentSecs % 60;
      timeCurrent.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }, 100);
  }

  function pauseAudio() {
    isAudioPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    if (audioTimerId) {
      clearInterval(audioTimerId);
    }
  }

  // 5. Reset Widget Handler
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      // Reset quiz states
      selectedOptionIndex = null;
      isSubmitted = false;
      isSolved = false;
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }

      // Reset DOM structures
      questionCard.className = 'question-card';
      optionItems.forEach(opt => {
        opt.className = 'option-item';
      });
      btnSubmit.removeAttribute('disabled');
      btnSubmit.setAttribute('disabled', 'true');
      btnSubmit.style.display = 'block';
      btnSubmit.textContent = 'Submit Answers';

      feedbackBox.className = 'quiz-feedback-box';
      unlockBanner.style.display = 'none';
      toastCountdown.textContent = '15:00';
      
      // Reset audio player
      pauseAudio();
      audioProgress = 0;
      timelineFill.style.width = '0%';
      timeCurrent.textContent = '0:00';
    });
  }
});
