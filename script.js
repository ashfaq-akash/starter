'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Showing users account balance

const displaymovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (movement, index) {
    const transactype = movement > 0 ? 'deposit' : 'withdrawal';
    console.log(`${index + 1}:${movement}`);
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${transactype}">${
      index + 1
    } ${transactype}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${movement}</div>
  </div>`;

    //Add html element in the web page
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
/////////////////////////////////////////////////////////////

//show total account value
const displayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = `${acc.balance}€`;
};

//Display user account summary of deposit,withdrawal,interest
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
///////////////////////////////////////////////////

//Update User Interface
function updateUI(acc) {
  //Display movements
  displaymovements(acc.movements);
  //Display Balance
  displayBalance(acc);
  //Display Summary
  calcDisplaySummary(acc);
}

///////////////////////

//Log in Functionality for individual users
accounts.forEach(
  accs =>
    (accs.username = accs.owner
      .toLowerCase()
      .split(' ')
      .map(n => n[0])
      .join(''))
);

let currentUser;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentUser);

  if (currentUser?.pin === Number(inputLoginPin.value)) {
    //Display login message and UI
    labelWelcome.textContent = `Welcome back,${currentUser.owner}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentUser);
  }
});

///////////////////////////////////////////

//Transfer money to one user from another user
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    transferAccount &&
    amount <= currentUser.balance &&
    transferAccount?.username !== currentUser.username
  ) {
    //Doing transfer the money
    currentUser.movements.push(-amount);
    transferAccount.movements.push(amount);
    updateUI(currentUser);
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
  }
});
//////////////////////////////////////////////

//Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.15)) {
    currentUser.movements.push(amount);
    updateUI(currentUser);
  }
  inputLoanAmount.value = '';
});
//////////////////////////////////////////////

//Close bank account by deleting the account index
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const confirmUser = inputCloseUsername.value;
  const confirmPin = Number(inputClosePin.value);
  if (confirmUser === currentUser.username && confirmPin === currentUser.pin) {
    const index = accounts.findIndex(
      acc => acc.username === currentUser.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

//////////////////////////////////////////////////

//sorting/////////////////////////////////////////

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displaymovements(currentUser.movements, !sorted);
  sorted = !sorted;
});
