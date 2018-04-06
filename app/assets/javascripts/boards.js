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
      const auth_token = form.children[1].value
      const boardDiv = event.path[3].children[1]
      const parentDiv = document.createElement('div')
      const parentForm = document.createElement('form')
      const utf8 = document.createElement('input')
      const method = document.createElement('input')
      const auth = document.createElement('input')
      const checkboxDiv = document.createElement('div')
      const checkboxInput = document.createElement('input')
      const checkbox = document.createElement('input')
      const emptyLabel = document.createElement('label')
      const taskNameDiv = document.createElement('div')
      const datePicker = document.createElement('input')
      const dateHidden = document.createElement('input')
      parentForm.action = '/tasks/'+responseData.id
      parentForm.acceptCharset = 'UTF-8'
      parentForm.method = 'post'
      dateHidden.type = 'hidden'
      dateHidden.name = 'date'
      dateHidden.value = ""
      datePicker.type = 'text'
      datePicker.name = 'datepicker'
      datePicker.placeholder = 'Deadline'
      taskNameDiv.innerText = responseData.task
      checkbox.type = 'checkbox'
      checkbox.value = 'true'
      checkbox.id = 'task_completed'
      checkbox.name = 'task[completed]'
      checkboxInput.name = 'task[completed]'
      checkboxInput.type = 'hidden'
      checkboxInput.value = 'false'
      auth.type = 'hidden'
      auth.name = 'authenticity_token'
      auth.value = auth_token
      method.type = 'hidden'
      method.name = '_method'
      method.value = 'patch'
      utf8.type = 'hidden'
      utf8.name = 'utf8'
      utf8.value = '✓'

      $(parentForm).addClass('ui labeled input')
      $(parentDiv).addClass('ui labeled input')
      $(checkboxDiv).addClass('ui checkbox')
      $(taskNameDiv).addClass('ui label')
      $(datePicker).addClass('form-control')
      // event listeners
      datePicker.addEventListener('click', function(event) {
        this.type = 'date';
        const currentDate = this.nextElementSibling.value
        this.value = `${currentDate}`
      });
      datePicker.addEventListener('change', function(event) {
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
      // appends after everything is complete
      checkboxDiv.appendChild(checkboxInput)
      checkboxDiv.appendChild(checkbox)
      checkboxDiv.appendChild(emptyLabel)

      parentDiv.appendChild(parentForm)
      parentForm.appendChild(utf8)
      parentForm.appendChild(method)
      parentForm.appendChild(auth)

      parentForm.appendChild(checkboxDiv)
      parentForm.appendChild(taskNameDiv)
      parentForm.appendChild(datePicker)
      parentForm.appendChild(dateHidden)

      boardDiv.appendChild(parentDiv)

      checkbox.addEventListener('change', function(event) {
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
