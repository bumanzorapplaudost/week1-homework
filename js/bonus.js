/* eslint-disable no-mixed-operators */
/* Declare all the constants that are going to be used during this program's execution. */
const formItem = document.querySelector('#aguinaldo-form');

const salaryInput = document.querySelector('#salary');
const yearsInput = document.querySelector('#years');
const daysInput = document.querySelector('#days');
const resetButton = document.getElementById('reset');

const salaryInvalidFeedback = document.querySelector('#salary_invalid');
const yearsInvalidFeedback = document.querySelector('#years_invalid');
const daysInvalidFeedback = document.querySelector('#days_invalid');

const resultsCardItem = document.getElementById('results');

const calculateBonus = () => {
  const calculatedResults = {
    salary: Number(salaryInput.value),
    years: Number(yearsInput.value),
    days: Number(daysInput.value),
    paidAmount: 0,
  };

  let aguinaldo = 0;
  if (calculatedResults.years === 0) {
    const baseSalary = (Number(salaryInput.value) / 30) * 15;
    aguinaldo = ((baseSalary * calculatedResults.days) / 365);
  } else if (calculatedResults.years <= 3) {
    aguinaldo = (calculatedResults.salary / 30) * 15;
  } else if (calculatedResults.years <= 10) {
    aguinaldo = (calculatedResults.salary / 30) * 19;
  } else {
    aguinaldo = (calculatedResults.salary / 30) * 21;
  }
  calculatedResults.paidAmount = aguinaldo;
  const result = `
  <div class="col-sm-12 col-md-4">
    <div class="card">
      <div class="card-header">
        <h4>Bonus Results</h4>
      </div>
      <div class="card-body bg-light">
        <table class="table table-bordered">
          <tr>
            <td class="text-right">Base Salary: </td>
            <td>$${calculatedResults.salary.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="text-right">Years Worked: </td>
            <td>${calculatedResults.years}</td>
          </tr>
          <tr>
            <td class="text-right">Days Worked: </td>
            <td>${calculatedResults.days}</td>
          </tr>
          <tr>
            <td class="text-right"><b>Bonus: </b></td>
            <td><b>$${calculatedResults.paidAmount.toFixed(2)}</b></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  `;
  resultsCardItem.innerHTML = result;
  resultsCardItem.classList.remove('d-none');
};

formItem.addEventListener('submit', (event) => {
  event.preventDefault();
  let validated = false;

  if (salaryInput.value === '' || salaryInput.value === '0' || typeof Number(salaryInput.value) === 'undefined') {
    salaryInput.classList.add('is-invalid');
    salaryInvalidFeedback.innerText = 'Salary must be greater than zero';
  } else {
    validated = true;
    salaryInput.classList.add('is-valid');
    salaryInput.classList.remove('is-invalid');
    salaryInvalidFeedback.innerText = '';
  }

  if (yearsInput.value === '' && (daysInput.value === '' || daysInput.value === '0') || yearsInput.value === '0' && (daysInput.value === '' || daysInput.value === '0')) {
    validated = false;
    yearsInput.classList.add('is-invalid');
    yearsInvalidFeedback.innerText = 'Years is a required field.';
  } else if (Number(yearsInput.value) > 35) {
    validated = false;
    yearsInput.classList.add('is-invalid');
    document.querySelector('#years_invalid').innerText = 'Years must be less than 35';
  } else {
    validated = true;
    yearsInput.classList.add('is-valid');
    yearsInput.classList.remove('is-invalid');
    yearsInvalidFeedback.innerText = '';
  }

  if ((daysInput.value === '' || daysInput.value === '0') && (yearsInput.value === '' || yearsInput.value === '0' || Number(yearsInput.value) > 35)) {
    validated = false;
    daysInput.classList.add('is-invalid');
    daysInvalidFeedback.innerText = 'Days must be greater than zero and less than 365';
  } else if (Number(daysInput.value) > 365 || (yearsInput.value > 35 && daysInput.value > 365)) {
    daysInvalidFeedback.innerHTML = 'Days <b>must</b> be greater than zero and less than 365';
  } else {
    validated = true;
    daysInput.classList.add('is-valid');
    daysInput.classList.remove('is-invalid');
    daysInvalidFeedback.innerText = '';
  }
  if (validated) {
    calculateBonus();
  }
});

yearsInput.addEventListener('keyup', () => {
  if (Number(yearsInput.value) > 0 && Number(yearsInput.value) < 35) {
    daysInput.setAttribute('disabled', 'true');
  } else {
    daysInput.removeAttribute('disabled');
  }
});

resetButton.addEventListener('click', () => {
  resultsCardItem.classList.add('d-none');
  document.querySelectorAll('.is-invalid').forEach((item) => {
    item.classList.remove('is-invalid');
    item.removeAttribute('disabled');
  });
  document.querySelectorAll('.is-valid').forEach((item) => {
    item.classList.remove('is-valid');
    item.removeAttribute('disabled');
  });
});
