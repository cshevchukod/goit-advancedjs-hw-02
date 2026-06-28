import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate;
let intervalId;

startBtn.disabled = true;

flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (!userSelectedDate) {
      startBtn.disabled = true;
      updateTimer(0);
      return;
    }

    if (userSelectedDate <= new Date()) {
      startBtn.disabled = true;

      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      return;
    }

    startBtn.disabled = false;
  },
});

startBtn.addEventListener('click', () => {
  if (!userSelectedDate || userSelectedDate <= new Date()) {
    startBtn.disabled = true;
    updateTimer(0);

    iziToast.error({
      message: 'Please choose a date in the future',
      position: 'topRight',
    });

    return;
  }

  startBtn.disabled = true;
  input.disabled = true;

  updateTimer(userSelectedDate - Date.now());

  intervalId = setInterval(() => {
    const difference = userSelectedDate - Date.now();

    if (difference <= 0) {
      clearInterval(intervalId);
      input.disabled = false;
      updateTimer(0);
      return;
    }

    updateTimer(difference);
  }, 1000);
});

function updateTimer(ms) {
  const time = convertMs(ms);

  daysEl.textContent = addLeadingZero(time.days);
  hoursEl.textContent = addLeadingZero(time.hours);
  minutesEl.textContent = addLeadingZero(time.minutes);
  secondsEl.textContent = addLeadingZero(time.seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  if (!Number.isFinite(ms) || ms < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
