moment.updateLocale('ru', { week: { dow: 1 } });

const dayTemplate = document.querySelector('#day').content.querySelector('.day');
const daysContainer = document.querySelector('.days');
const footerMonth = document.querySelector('.footer__month');

const ruMonths = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

let monthCount = 0;

const renderMonths = () => {
  removeDaysListeners();

  const selectedMonth = moment().add(monthCount, 'month');
  const selectedMonthTitle = ruMonths[selectedMonth.month()];

  const startDayOfMonth = Number(selectedMonth.startOf('month').day());

  const daysInMonth = selectedMonth.daysInMonth();
  const neededDays = 42 - daysInMonth;

  const currentDay = Number(moment().format('D'));

  const currentMonthDays = [];

  footerMonth.textContent = `${selectedMonthTitle} ${selectedMonth.format('yyyy')}`;

  for (let i = 1; i <= daysInMonth; i = i + 1) {

    let isCurrentDay = false;
    let passed = true;

    if (monthCount === 0) {
      isCurrentDay = currentDay === i;
      passed = currentDay > i;
    } else if (monthCount < 0) {
      isCurrentDay = false;
      passed = true;
    } else {
      isCurrentDay = false;
      passed = false;
    }

    const day = {
      id: `${i}${selectedMonthTitle}`,
      dayTitle: 'Яблочный Спас',
      month: selectedMonthTitle,
      day: i,
      isCurrentDay,
      passed,
    };

    currentMonthDays.push(day);
  };

  const lastMonthDays = [];
  const previousMonth = selectedMonth.subtract(1, 'month');
  const daysInPreviousMonth = previousMonth.daysInMonth();

  for (let i = 0; i <= startDayOfMonth - 1; i = i + 1) {
    if (lastMonthDays.length === startDayOfMonth - 1) {
      break
    };

    const day = {
      id: `${i}${ruMonths[Number(previousMonth.format('M')) - 1]}`,
      dayTitle: 'Яблочный Спас',
      month: ruMonths[Number(previousMonth.format('M')) - 1],
      day: daysInPreviousMonth - i,
      isCurrentDay: false,
      passed: true,
    };

    lastMonthDays.push(day);
  };

  lastMonthDays.reverse();

  const nextMonthDays = [];
  const nextMonth = ruMonths[Number(selectedMonth.add(1, 'month').format('M'))];

  for (let i = 1; i <= neededDays - lastMonthDays.length; i = i + 1) {
    let passed = false;

    if (monthCount < 0) {
      passed = true;
    }

    const day = {
      id: `${i}${nextMonth}`,
      dayTitle: 'Яблочный Спас',
      month: nextMonth,
      day: i,
      isCurrentDay: false,
      passed,
    };

    nextMonthDays.push(day);
  };

  const calendarData = [...lastMonthDays, ...currentMonthDays, ...nextMonthDays];

  calendarData.map((day) => {
    const dayCard = dayTemplate.cloneNode(true);
    dayCard.querySelector('.day__number').textContent = day.day;
    dayCard.querySelector('.day__month').textContent = day.month;

    if (day.passed) {
      dayCard.classList.add('day_type_passed');
    }
    if (day.isCurrentDay) {
      dayCard.classList.add('day_type_current');
    }
    daysContainer.append(dayCard)
  });

  addDaysListeners();
};

const handleDecrementMonth = () => {
  daysContainer.innerHTML = '';
  monthCount = monthCount - 1;
  renderMonths();
};

const handleIncrementMonth = () => {
  daysContainer.innerHTML = '';
  monthCount = monthCount + 1;
  renderMonths();
};

const handleDayClick = (e) => {

  const selectedDay = e.target;
  const infoSection = selectedDay.querySelector('.day__info');
  if (selectedDay.classList.contains('day_type_selected')) {
    selectedDay.classList.remove('day_type_selected');
    infoSection.classList.remove('day__info_type_checked');
  } else {
    const daysArr = document.querySelectorAll('.day');
    daysArr.forEach((day) => {
      day.classList.remove('day_type_selected');
      day.querySelector('.day__info').classList.remove('day__info_type_checked');
    });

    selectedDay.classList.add('day_type_selected');
    infoSection.classList.add('day__info_type_checked');
  }
};

const addDaysListeners = () => {
  const daysArr = document.querySelectorAll('.day');
  daysArr.forEach((day) => {
    day.addEventListener('click', handleDayClick);

    const dayInfo = day.querySelector('.day__info');

    const listPosition = daysContainer.getBoundingClientRect();
    const dayPosition = day.getBoundingClientRect();
    const relativeLeftPosition = dayPosition.left - listPosition.left;

    dayInfo.style.width = `${listPosition.width}px`;
    dayInfo.style.left = `-${relativeLeftPosition}px`;
  });
};

const removeDaysListeners = () => {
  const daysArr = document.querySelectorAll('.day');
  daysArr.forEach((day) => {
    day.removeEventListener('click', handleDayClick);
  });
};

renderMonths();

prevButton.addEventListener('click', handleDecrementMonth);
nextButton.addEventListener('click', handleIncrementMonth);