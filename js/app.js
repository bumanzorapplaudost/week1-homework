/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
const formItem = document.querySelector('#taskform');
const alertDisplayer = document.querySelector('.alert-displayer');

const idInput = document.querySelector('#id');
const nameInput = document.querySelector('#name');
const assigneeDropDown = document.querySelector('#assignee');
const statusCheckBox = document.querySelector('#status');
const creationDateInput = document.querySelector('#creation_date');
const submitButton = document.querySelector('#btn_submit');
const resetButton = document.querySelector('#reset');

const searchInput = document.querySelector('#search');
const filterDropDown = document.querySelector('#filter');
const sortButton = document.querySelector('#sort');
const tableItem = document.querySelector('#table');
const filterResetButton = document.querySelector('#filter-button');

let tasksFromLocalStorage;

const fillHTMLTable = (filtered = '') => {
  let table = '';
  const tasksToDisplay = Array.isArray(filtered) ? filtered : tasksFromLocalStorage;
  if (Array.isArray(tasksToDisplay) && tasksToDisplay.length > 0) {
    tasksToDisplay.forEach(((task) => {
      const status = task.status ? 'Done' : 'Pending';
      table += `
        <tr>
          <td class="d-none d-md-block">${task.id}</td>
          <td>${task.name}</td>
          <td>${task.assignee === '' ? 'Unassigned' : task.assignee}</td>
          <td>${status}</td>
          <td class="d-none d-md-block">${task.creationDate}</td>
          <td>
            <div class="btn-group">
              <button class="btn btn-sm btn-outline-info" onclick="editTask(${task.id})">
                <i class="fa fa-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="removeTaskItem(${task.id})">
                <i class="fa fa-times"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }));
  } else {
    table += `
      <tr>
        <td colspan="6" class="text-center">
          No records to show...
        </td>
      </tr>
    `;
  }
  tableItem.innerHTML = table;
};

const addTaskItem = (id) => {
  const date = new Date();
  const taskId = id;
  const name = nameInput.value;
  const assignee = assigneeDropDown.value;
  const status = statusCheckBox.checked;
  const newTask = {
    name,
    assignee,
    status,
    id: taskId,
    creationDate: `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString()}`,
  };
  tasksFromLocalStorage.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasksFromLocalStorage));
  resetButton.click();
  fillHTMLTable();
  alertDisplayer.innerHTML = '<div class="alert alert-success" role="alert">The task was saved! </div>';
  setTimeout(() => {
    alertDisplayer.innerHTML = '&nbsp;';
  }, 2000);
};

const editTaskItem = (currentId) => {
  const taskToEdit = {
    id: currentId,
    name: nameInput.value,
    assignee: assigneeDropDown.value,
    creationDate: creationDateInput.value,
    status: statusCheckBox.checked,
  };
  tasksFromLocalStorage = tasksFromLocalStorage.filter((a) => a.id !== currentId);
  tasksFromLocalStorage.push(taskToEdit);
  localStorage.setItem('tasks', JSON.stringify(tasksFromLocalStorage.sort((a, b) => a.id - b.id)));
  resetButton.click();
  alertDisplayer.innerHTML = '<div class="alert alert-info" role="alert">The task was successfully updated! </div>';
  setTimeout(() => {
    alertDisplayer.innerHTML = '&nbsp;';
  }, 2000);
  fillHTMLTable();
};

const removeTaskItem = (id) => {
  if (confirm('Are you sure you want to remove this task?')) {
    setTimeout(() => {
      const index = tasksFromLocalStorage.findIndex((task) => task.id === id);
      tasksFromLocalStorage.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasksFromLocalStorage));
      fillHTMLTable();
      alertDisplayer.innerHTML = '<div class="alert alert-success" role="alert">The task was successfully removed! </div>';
      setTimeout(() => {
        alertDisplayer.innerHTML = '&nbsp;';
      }, 2000);
    }, 1000);
  }
};

const editTask = (id) => {
  const taskToEdit = tasksFromLocalStorage.filter((task) => task.id === id)[0];

  idInput.value = taskToEdit.id;
  nameInput.value = taskToEdit.name;
  assigneeDropDown.value = taskToEdit.assignee;
  statusCheckBox.checked = taskToEdit.status;
  creationDateInput.value = taskToEdit.creationDate;
  submitButton.innerText = 'Save changes';
};

const filterTasks = () => {
  const appendForFilter = document.querySelector('#append-for-filter');
  const inputGroup = document.querySelector('#input-group');
  const filter = filterDropDown.value;
  let filteredTasks = [];
  if (filter !== '') {
    inputGroup.classList.add('input-group');
    appendForFilter.classList.add('d-block');
    appendForFilter.classList.remove('d-none');
    filteredTasks = tasksFromLocalStorage.filter((task) => task.status === Boolean(Number(filter)));
  } else {
    inputGroup.classList.remove('input-group');
    appendForFilter.classList.remove('d-block');
    appendForFilter.classList.add('d-none');
    filteredTasks = tasksFromLocalStorage;
  }

  return filteredTasks;
};

if (localStorage.getItem('tasks') === null) {
  localStorage.setItem('tasks', JSON.stringify([]));
}

window.addEventListener('load', () => {
  tasksFromLocalStorage = JSON.parse(localStorage.getItem('tasks'));
  fillHTMLTable();
});

formItem.addEventListener('submit', (event) => {
  event.preventDefault();
  const errorTextItem = document.querySelector('#itd');
  let lastId = 0;

  if (nameInput.value.trim() === '') {
    nameInput.classList.add('is-invalid');
    errorTextItem.innerText = 'Name is a required field.';
    nameInput.focus();
  } else if (nameInput.value.length > 100) {
    errorTextItem.innerText = 'Name must be 100 characters or less.';
    nameInput.classList.add('is-invalid');
    nameInput.focus();
  } else {
    nameInput.classList.remove('is-invalid');
    nameInput.classList.add('is-valid');
    submitButton.setAttribute('disabled', 'true');
    submitButton.innerText = 'Please wait...';

    if (Array.isArray(tasksFromLocalStorage) && tasksFromLocalStorage.length > 0) {
      lastId = tasksFromLocalStorage[tasksFromLocalStorage.length - 1].id;
    } else {
      lastId = 0;
    }
    const currentId = idInput.value !== '' ? Number(idInput.value) : lastId + 1;
    setTimeout(() => {
      if (document.querySelector('#id').value !== '') {
        editTaskItem(currentId);
      } else {
        addTaskItem(currentId);
      }
      submitButton.removeAttribute('disabled');
    }, 2000);
  }
});

resetButton.addEventListener('click', () => {
  submitButton.innerText = 'Create task';
  nameInput.classList.remove('is-invalid');
  nameInput.classList.remove('is-valid');
});

searchInput.addEventListener('keyup', () => {
  const text = searchInput.value.toLowerCase();
  const filtered = tasksFromLocalStorage.filter((task) => {
    const name = task.name.toLowerCase();
    if (filterDropDown.value !== '') {
      return name.includes(text) && Boolean(Number(filterDropDown.value)) === task.status;
    }
    return name.includes(text);
  });
  fillHTMLTable(filtered);
});

filterDropDown.addEventListener('change', () => {
  const filteredTasks = filterTasks();
  fillHTMLTable(filteredTasks);
});

sortButton.addEventListener('click', (event) => {
  event.preventDefault();
  const tasksToOrder = filterDropDown.value !== '' ? filterTasks() : tasksFromLocalStorage;

  if (sortButton.getAttribute('href') === '#up') {
    sortButton.innerHTML = 'Creation date <i class="fa fa-arrow-down"></i>';
    sortButton.setAttribute('href', '#down');
    tasksToOrder.sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());
  } else {
    sortButton.innerHTML = 'Creation date <i class="fa fa-arrow-up"></i>';
    sortButton.setAttribute('href', '#up');
    tasksToOrder.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
  }
  if (filterDropDown.value !== '') {
    fillHTMLTable(tasksToOrder);
  } else {
    fillHTMLTable();
  }
});

filterResetButton.addEventListener('click', () => {
  filterDropDown.value = '';
  const filteredTasks = filterTasks();
  fillHTMLTable(filteredTasks);
});
