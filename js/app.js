/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
const formItem = document.querySelector('#taskform');

const idInput = document.querySelector('#id');
const descriptionInput = document.querySelector('#description');
const assigneeDropDown = document.querySelector('#assignee');
const statusCheckBox = document.querySelector('#status');
const creationDateInput = document.querySelector('#creation_date');
const submitButton = document.querySelector('#btn_submit');
const resetButton = document.querySelector('#reset');

const searchInput = document.querySelector('#search');
const filterDropDown = document.querySelector('#filter');
const sortButton = document.querySelector('#sort');
const tableItem = document.querySelector('#table');

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
          <td>${task.description}</td>
          <td>${task.assignee === '' ? 'Unassigned' : task.assignee}</td>
          <td>${status}</td>
          <td class="d-none d-md-block">${task.creationDate}</td>
          <td>
            <div class="btn-group">
              <button class="btn btn-sm btn-info" onclick="editTask(${task.id})">
                <i class="fa fa-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger" onclick="removeTaskItem(${task.id})">
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
  const description = descriptionInput.value;
  const assignee = assigneeDropDown.value;
  const status = statusCheckBox.checked;
  const newTask = {
    description,
    assignee,
    status,
    id: taskId,
    creationDate: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
  };
  tasksFromLocalStorage.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasksFromLocalStorage));
  resetButton.click();
  fillHTMLTable();
  alert('Task has been added');
};

const editTaskItem = (currentId) => {
  const taskToEdit = {
    id: currentId,
    description: descriptionInput.value,
    assignee: assigneeDropDown.value,
    creationDate: creationDateInput.value,
    status: statusCheckBox.checked,
  };
  tasksFromLocalStorage = tasksFromLocalStorage.filter((a) => a.id !== currentId);
  tasksFromLocalStorage.push(taskToEdit);
  localStorage.setItem('tasks', JSON.stringify(tasksFromLocalStorage.sort((a, b) => a.id - b.id)));
  resetButton.click();
  alert('Task was successfully updated');
  fillHTMLTable();
};

const removeTaskItem = (id) => {
  if (confirm('Are you sure you want to remove this task?')) {
    setTimeout(() => {
      const index = tasksFromLocalStorage.findIndex((task) => task.id === id);
      tasksFromLocalStorage.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasksFromLocalStorage));
      fillHTMLTable();
      alert('The task was successfully removed.');
    }, 1000);
  }
};

const editTask = (id) => {
  const taskToEdit = tasksFromLocalStorage.filter((task) => task.id === id)[0];

  idInput.value = taskToEdit.id;
  descriptionInput.value = taskToEdit.description;
  assigneeDropDown.value = taskToEdit.assignee;
  statusCheckBox.checked = taskToEdit.status;
  creationDateInput.value = taskToEdit.creationDate;
  submitButton.innerText = 'Save changes';
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

  if (descriptionInput.value.trim() === '') {
    descriptionInput.classList.add('is-invalid');
    errorTextItem.innerText = 'Description is a required field.';
  } else if (descriptionInput.value.length > 100) {
    errorTextItem.innerText = 'Description must be 100 characters or less.';
    descriptionInput.classList.add('is-invalid');
  } else {
    descriptionInput.classList.remove('is-invalid');
    descriptionInput.classList.add('is-valid');
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
  descriptionInput.classList.remove('is-invalid');
  descriptionInput.classList.remove('is-valid');
});

searchInput.addEventListener('keyup', () => {
  const text = searchInput.value.toLowerCase();
  const filtered = tasksFromLocalStorage.filter((task) => {
    const description = task.description.toLowerCase();
    if (filterDropDown.value !== '') {
      return description.includes(text) && Boolean(Number(filterDropDown.value)) === task.status;
    }
    return description.includes(text);
  });
  fillHTMLTable(filtered);
});

filterDropDown.addEventListener('change', () => {
  const filter = filterDropDown.value;
  let filteredTasks = [];
  if (filter !== '') {
    filteredTasks = tasksFromLocalStorage.filter((task) => task.status === Boolean(Number(filter)));
  } else {
    filteredTasks = tasksFromLocalStorage;
  }
  fillHTMLTable(filteredTasks);
});

sortButton.addEventListener('click', (event) => {
  event.preventDefault();
  if (sortButton.getAttribute('href') === '#up') {
    sortButton.innerHTML = 'Creation date <i class="fa fa-arrow-down"></i>';
    sortButton.setAttribute('href', '#down');
    tasksFromLocalStorage.sort((a, b) => {
      if (a.creationDate < b.creationDate) return -1;
      if (a.creationDate > b.creationDate) return 1;
      return 0;
    });
  } else {
    sortButton.innerHTML = 'Creation date <i class="fa fa-arrow-up"></i>';
    sortButton.setAttribute('href', '#up');
    tasksFromLocalStorage.sort((a, b) => {
      if (a.creationDate > b.creationDate) return -1;
      if (a.creationDate < b.creationDate) return 1;
      return 0;
    });
  }
  fillHTMLTable();
});
