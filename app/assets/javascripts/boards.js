// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

document.addEventListener('DOMContentLoaded', function(e) {

const newBoardBtn = document.querySelector('.new_board_btn');
const boardParent = document.querySelector('#parent_board');
const container = document.querySelector('.container');
const boardCancel = document.querySelector('.board_cancel');
const boardInput = document.querySelector('#board_form');
const allTaskForms = document.querySelectorAll('.task_div')
const datePickers = document.querySelectorAll('.form-control')
const checkboxes = document.querySelectorAll('#task_completed')

for (var i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener('change', function(event) {
    event.preventDefault()
    const checkbox = this.checked
    const url = event.target.form.action
    $.ajax({
      url: url,
      type: 'PATCH',
      data: {task: {completed: checkbox}},
      dataType: 'JSON'
    }).done(function(responseData) {
      const label = event.target.parentElement.parentElement.children[4]
      if (event.target.checked == true) {
        label.style.backgroundColor = 'Aquamarine'
      } else {
        label.style.backgroundColor = '#E8E8E8'
      }

    }).fail(function(_jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    })
  })
  if (checkboxes[i].checked) {
    const label = checkboxes[i].parentElement.nextElementSibling
    label.style.backgroundColor = 'Aquamarine'
  }
}

for (var i = 0; i < datePickers.length; i++) {
  datePickers[i].addEventListener('click', function(event) {
    this.type = 'date';
    const currentDate = this.nextElementSibling.value
    this.value = `${currentDate}`
  });
  datePickers[i].addEventListener('change', function(event) {
    const changedDate = event.target.value
    const checkbox = event.target.parentElement.parentElement.children[0][4].value;
    const url = event.target.parentElement.action
    event.preventDefault()
    $.ajax({
      url: url,
      type: 'PATCH',
      data: {datepicker: changedDate, task: {completed: checkbox}},
      dataType: 'JSON'
    }).done(function(responseData) {
      const changeDate = Object.keys(responseData)[0]
      const hiddenForm = event.target.nextElementSibling
      hiddenForm.value = `${changedDate}`
    }).fail(function(_jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    })
  });
};

for (var i = 0; i < allTaskForms.length; i++) {
  allTaskForms[i].children[0].children[0].addEventListener('submit', function(event) {
    event.preventDefault();
    const form = this
    // console.log(this.children[2]);
    $.ajax({
      url: '/tasks',
      type: 'POST',
      data: $(form).serialize(),
      dataType: 'json'
    }).done(function(responseData) {
      const taskSpan = document.createElement('span')
      const boardDiv = event.path[3].children[1]
      console.log(event);
      $(taskSpan).addClass('board_text')
      taskSpan.innerText = responseData.task
      boardDiv.appendChild(taskSpan)
    }).fail(function(_jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    })
  });
}

newBoardBtn.addEventListener('click', createBoard);

function cancelBoard() {
  const thisBoard = this.parentNode.parentNode.parentNode
  $(thisBoard).replaceWith(newBoardBtn);
}

function createBoard() {
  const clone = $('#parent_board').clone().removeClass( 'hidden' ).removeAttr('id');
  const cloneInput = clone[0].children[1].children[0]
  const cloneCancel = clone[0].children[1].firstElementChild.children[4]
  cloneCancel.addEventListener('click', cancelBoard)
  $(clone).on('submit', function(event) {
    event.preventDefault();
    $.ajax({
    url: '/boards',
    type: 'POST',
    data: $(cloneInput).serialize(),
    dataType: 'JSON'
  }).done(function(responseData) {   // ajax request creates the board with the proper board name
      const boardDiv = document.createElement('div')
      const boardSpan = document.createElement('span')
      const taskBtn = document.createElement('button')
      const taskDiv = document.createElement('div')
      const taskAction = document.createElement('div')
      const taskInputBtn = document.createElement('button')
      const taskInput = document.createElement('input')
      $(taskInputBtn).addClass('ui button')
      $(boardDiv).addClass('board')
      $(taskAction).addClass('ui action input')
      $(boardSpan).addClass('board_text')
      $(taskDiv).addClass('task_div')
      $(taskBtn).addClass('ui button')
      $(taskBtn).attr('id', 'new_task_btn');
      taskInput.type = 'text'
      taskInput.placeholder = 'Task...'
      taskBtn.innerText = 'New Task'
      taskInputBtn.innerText = 'Add Task'
      boardSpan.innerText = responseData.board
      taskDiv.appendChild(taskAction)
      taskAction.appendChild(taskInput)
      taskAction.appendChild(taskInputBtn)
      boardDiv.appendChild(boardSpan)
      boardDiv.appendChild(taskDiv)
      boardDiv.appendChild(taskBtn)
      container.appendChild(boardDiv)
      $(clone).replaceWith(newBoardBtn);
      taskBtn.addEventListener('click', createTask)
    }).fail(function(_jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    });
  });
  $('.new_board_btn').replaceWith(clone);
}





});
