"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      
      <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposits) => (deposits * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      //console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = (accs) => {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);

const updateUI = (acc) => {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Event handler
let currentAccount;

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc?.username !== currentAccount.username
  ) {
    // transfert
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);

    inputTransferAmount.value = inputTransferTo.value = "";
  }
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some((mov) => mov >= amount)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = "";
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    // delete account
    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = "";
  }
});

let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const eurToUsd = 1.1;
const movementsUSD = movements.map((mov) => mov * eurToUsd);

const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? "deposit" : "withdrew"} ${Math.abs(
      mov
    )} `
);

// FILTER
const deposits = movements.filter((mov) => {
  return mov < 0;
});

console.log(movements);
console.log(deposits);

const depositFor = [];
for (const mov of movements) if (mov < 0) depositFor.push(mov);
console.log(depositFor);

// REDUCE

// accumulator ->SNOWBALL
const balance = movements.reduce((acc, current, i) => {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + current;
}, 0);
console.log(balance);

// Maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

console.log(max);

const totalDepositsUSD = movements
  .filter((mov) => mov > 0)
  .map((mov, i, arr) => {
    console.log(arr);
    return mov * eurToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD);

const firstWithdrawal = movements.find((mov) => mov < 0);
console.log(firstWithdrawal);

const account = accounts.find((acc) => acc.owner === "Jessica Davis");
console.log(account);*/

// EQUALITY
console.log(account1.movements);
console.log(account1.movements.includes(-130));

// SOME:CONDIDTION
const anyDeposits = account1.movements.some((mov) => mov > 5000);
console.log(anyDeposits);

console.log(account1.movements.some((mov) => mov < 5000));

// EVERY
console.log(account1.movements.every((mov) => mov > 0));

// Separate callback
const deposit = (mov) => mov > 0;
console.log(account1.movements.some(deposit));
console.log(account1.movements.every(deposit));
console.log(account1.movements.filter(deposit));

// flat method

const arr = [[1, 2, 2], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [
  [
    [1, 2, 2],
    [4, 5, 6],
  ],
  7,
  8,
];
console.log(arrDeep.flat(2));

const accountMovement = accounts.map((acc) => acc.movements);

const allMovements = accountMovement.flat();
console.log(allMovements);

const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

// flatMap method

const arr2 = [[1, 2, 2], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep2 = [
  [
    [1, 2, 2],
    [4, 5, 6],
  ],
  7,
  8,
];
console.log(arrDeep2.flat(2));

const overalBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);

const owners = ["Jonas", "Zack", "Adam", "Martha"];
console.log(owners);
console.log(owners.sort());

account1.movements.sort((a, b) => {
  if (a > b) return 1;
  if (b > a) return -1;
});

console.log(account1.movements);

// fill
const x = new Array(7);
console.log(x);

// x.fill(2);
// console.log(x);
x.fill(1, 3, 5);
console.log(x);

// Array.from

/*const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener("click", () => {
  const movementsUI = Array.from(document.querySelectorAll(".movements_value"),
  el=> Number(el.textContent.replace("€", ""))
  );
  console.log(movementsUI);
});*/

// Array method practice

// 1.
const bankDepositSum = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);

// 2.
const numDeposits1000 = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov > 1000).length;
console.log(numDeposits1000);

const numDeposits1000S = accounts
  .flatMap((acc) => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposits1000S);

// 3.
// const sums = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// 4.
// This is a nice title ->This Is a Nice Title
const convertTitleCase = (title) => {
  const exceptions = ["a", "an", "the", "but", "or", "on", "in", "with"];
  const titltCase = title
    .toLowerCase()
    .split(" ")
    .map((word) =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(" ");
  return titltCase;
};

console.log(convertTitleCase("this is a nice title"));
console.log(convertTitleCase("this is a LONG title but not too long"));
console.log(convertTitleCase("and here is another title with an EXAMPLE"));
