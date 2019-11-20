/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
// Form
const formItem = document.querySelector('#taskform');

/* Form Items */
const idInput = document.querySelector('#id');
const descriptionInput = document.querySelector('#description');
const assigneeDropDown = document.querySelector('#assignee');
const statusCheckBox = document.querySelector('#status');
const creationDateInput = document.querySelector('#creation_date');
const submitButton = document.querySelector('#btn_submit');
const resetButton = document.querySelector('#reset');

// Search and filter Items
const searchInput = document.querySelector('#search');
const filterDropDown = document.querySelector('#filter');
const sortButton = document.querySelector('#sort');
const tableItem = document.querySelector('#table');

const fillHTMLTable = (tasks) => {
  let table = '';
  if (typeof tasks[0] !== 'undefined') {
    tasks.forEach(((task) => {
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

/**
 * This function is called once the validations have been passed,
 * Pretty much its functionality is create a new Object and add it to the array then save it in the local storage
 * Once the array is saved we will only need to call the fillHTMLTable() function and pass the new array of tasks
 */

const addTaskItem = (tasks, id) => {
  const date = new Date();
  const taskId = id;
  const description = descriptionInput.value;
  const assignee = assigneeDropDown.value;
  const status = statusCheckBox.checked;
  const newTask = {
    id: taskId,
    description,
    assignee,
    creationDate: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
    status,
  };
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  resetButton.click();
  fillHTMLTable(JSON.parse(localStorage.getItem('tasks')));
  alert('Task has been added');
};

/**
 * This function is called once the validations have been passed,
 * this function, besides receiving the tasks list it also receives the currentID.
 * It is called from another function triggered once we click the edit button.
 * Pretty much its functionality is to update an existing object.
 * It gets the array without the one we're editing and then re-add it
 * Once the array is saved we will only need to call the fillHTMLTable() function and pass the new array of tasks
 */
const editTaskItem = (tasks, currentId) => {
  const taskToEdit = {
    id: currentId,
    description: descriptionInput.value,
    assignee: assigneeDropDown.value,
    creationDate: creationDateInput.value,
    status: statusCheckBox.checked,
  };
  const newTasks = tasks.filter((a) => a.id != currentId);
  newTasks.push(taskToEdit);
  localStorage.setItem('tasks', JSON.stringify(newTasks.sort((a, b) => a.id - b.id)));
  resetButton.click();
  alert('Task was successfully updated');
  fillHTMLTable(JSON.parse(localStorage.getItem('tasks')));
};

const removeTaskItem = (id) => {
  if (confirm('Are you sure you want to remove this task?')) {
    setTimeout(() => {
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      const index = tasks.findIndex((task) => task.id === id);
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      fillHTMLTable(tasks);
      alert('The task was successfully removed.');
    }, 1000);
  }
};

const editTask = (id) => {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const taskToEdit = tasks.filter((task) => task.id === id)[0];

  idInput.value = taskToEdit.id;
  descriptionInput.value = taskToEdit.description;
  assigneeDropDown.value = taskToEdit.assignee;
  statusCheckBox.checked = taskToEdit.status;
  creationDateInput.value = taskToEdit.creationDate;
  submitButton.innerText = 'Save changes';
};

// if the Tasks Item does not exist in the localStorage it will be initialized as empty.
if (localStorage.getItem('tasks') === null) {
  localStorage.setItem('tasks', JSON.stringify([]));
}

// The table will be automatically filled once the window loads.
window.addEventListener('load', () => {
  fillHTMLTable(JSON.parse(localStorage.getItem('tasks')));
});

// Event triggered once we try to submit the button
formItem.addEventListener('submit', (event) => {
  event.preventDefault();
  const errorTextItem = document.querySelector('#itd');
  let lastId = 0;
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  /*
    * Validation before submitting the form.
    *If the validations are passed, this event will call either the editTaskItem or the addTaskItem function.
  */
  if (descriptionInput.value.trim() === '') {
    descriptionInput.classList.add('is-invalid');
    errorTextItem.innerHTML = 'Description is a required field.';
  } else if (descriptionInput.value.length > 100) {
    errorTextItem.innerHTML = 'Description must be 100 characters or less.';
    descriptionInput.classList.add('is-invalid');
  } else {
    descriptionInput.classList.remove('is-invalid');
    descriptionInput.classList.add('is-valid');
    submitButton.setAttribute('disabled', 'true');
    submitButton.innerText = 'Please wait...';

    if (typeof tasks[0] !== 'undefined') {
      lastId = tasks[tasks.length - 1].id;
    } else {
      lastId = 0;
    }
    const currentId = idInput.value !== '' ? Number(idInput.value) : lastId + 1;
    setTimeout(() => {
      if (document.querySelector('#id').value !== '') {
        editTaskItem(tasks, currentId);
      } else {
        addTaskItem(tasks, currentId);
      }
      submitButton.removeAttribute('disabled');
    }, 2000);
  }
});

// Besides resetting the form, this button will also remove the error and valid input classes
resetButton.addEventListener('click', () => {
  submitButton.innerHTML = 'Create task';
  descriptionInput.classList.remove('is-invalid');
  descriptionInput.classList.remove('is-valid');
});

// This event will be triggered everytime a key is pressed in order to search by Task Description
searchInput.addEventListener('keyup', () => {
  const text = searchInput.value.toLowerCase();
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const filtered = tasks.filter((task) => task.description.toLowerCase().includes(text));
  fillHTMLTable(filtered);
});

/*
  * Every time we change the value of the filter dropdown, the table will only show the records that match it
  * If the item selected does not have a value, the table will display all records.
*/
filterDropDown.addEventListener('change', () => {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  const filter = filterDropDown.value;
  if (filter != '') {
    tasks = tasks.filter((task) => task.status == Number(filter));
  }
  fillHTMLTable(tasks);
});

/**
 * The sort button will order the records by creation date either ascending or descending.
 * By default the table is ordered by ID in a descending way.
 */
sortButton.addEventListener('click', (event) => {
  event.preventDefault();
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  if (sortButton.getAttribute('href') == '#up') {
    sortButton.innerHTML = '<i class="fa fa-arrow-down"></i>';
    sortButton.setAttribute('href', '#down');
    tasks.sort((a, b) => {
      if (a.creationDate < b.creationDate) return -1;
      if (a.creationDate > b.creationDate) return 1;
      return 0;
    });
  } else {
    sortButton.innerHTML = '<i class="fa fa-arrow-up"></i>';
    sortButton.setAttribute('href', '#up');
    tasks.sort((a, b) => {
      if (a.creationDate > b.creationDate) return -1;
      if (a.creationDate < b.creationDate) return 1;
      return 0;
    });
  }
  fillHTMLTable(tasks);
});
