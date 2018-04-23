document.addEventListener('DOMContentLoaded', function(e) {

  // selectors //
  const newBoardBtn = document.querySelector('.new_board_btn');
  const boardParent = document.querySelector('#parent_board');
  const container = document.querySelector('.container');
  const boardCancel = document.querySelector('.board_cancel');
  const boardInput = document.querySelector('#board_form');
  const allTaskForms = document.querySelectorAll('.task_div')
  const datePickers = document.querySelectorAll('.form-control')
  const checkboxes = document.querySelectorAll('#task_completed')
  const taskList = document.querySelectorAll('.task_list')
  const boardCloseButtons = document.querySelectorAll('.close')
  const allLabels = document.querySelectorAll('.label')

  // event listeners //
  for (var i = 0; i < boardCloseButtons.length; i++) {
    boardCloseButtons[i].addEventListener('click', deleteBoard)
  }

  for (var i = 0; i < allLabels.length; i++) {
    allLabels[i].addEventListener('click', showTodos)
  }

  if (newBoardBtn) {
    newBoardBtn.addEventListener('submit', createBoard);
    newBoardBtn.addEventListener('click', createBoard);
  }

  // calling ajax to check if the task is completed or not
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
      }).done(function(responseData) { // setting the task label to green if completed or grey if not completed
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

  // add click event to change deadline placeholder text to html5 date field
  for (var i = 0; i < datePickers.length; i++) {
    datePickers[i].addEventListener('click', function(event) {
      this.type = 'date';
      const currentDate = this.nextElementSibling.value
      this.value = `${currentDate}`
    });

    datePickers[i].addEventListener('change', function(event) {
      // ajax call once a deadline date has been selected
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
        // sets the date to the correct date picked
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
    allTaskForms[i].children[0].children[0].addEventListener('submit', createTask)
  }

  // functions //

  function showTodos() {
    const form = this.parentNode
    const url = form.action
    console.log(url);
    console.log(form);
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'JSON',
    }).done(function(responseData) {
      console.log(responseData);
      const todoContainer = document.createElement('div')
      const todoSpan = document.createElement('span')
      $('body').addClass('stop-scrolling')
      $(todoContainer).addClass('todos_board')
        $.each(responseData, function(i) {
          const todoSpan = document.createElement('span')
          $(todoSpan).addClass('board_text')
          let name = responseData[i].name
          let deadline = responseData[i].deadline
          todoSpan.innerText = name
          todoContainer.appendChild(todoSpan)
        });
      container.appendChild(todoContainer)
    }).fail(function(_jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    })
  }

  function cancelBoard() {
    const thisBoard = this.parentNode.parentNode.parentNode
    $(thisBoard).replaceWith(newBoardBtn);
  }

  function createTask(event) {
    event.preventDefault();
    console.dir(event);
    if (event.type == "submit") {
      var form = this
      var boardDiv = event.path[3].children[2]
    } else {
      var form = event.path[1]
      var boardDiv = event.path[4].children[2]
    }

    // create ajax call when creating a new task
    $.ajax({
      url: '/tasks',
      type: 'POST',
      data: $(form).serialize(),
      dataType: 'json'
    }).done(function(responseData) {
      const auth_token = form.children[1].value
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
      $(parentDiv).addClass('ui labeled input ui-state-default ui-sortable-handle')
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
        const cloneNode = document.body.children[1].children[2].cloneNode(true)
        const boardName = cloneNode.children[1]
        const deleteBoardBtn = cloneNode.children[0]
        const inputForm = cloneNode.children[3].firstElementChild.firstElementChild
        const boardIDform = inputForm.children[4]
        const formButton = inputForm.children[3]
        $(cloneNode).removeClass('hidden')
        boardName.innerText = responseData.board
        boardIDform.value = responseData.id
        formButton.addEventListener('click', createTask)
        formButton.addEventListener('submit', createTask)
        deleteBoardBtn.addEventListener('click', deleteBoard)
        container.appendChild(cloneNode)
        // -- sets new board button back -- //

        const thisBoard = event.target.parentNode.parentNode
        $(thisBoard).replaceWith(newBoardBtn);
      }).fail(function(_jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
      });
    });
    $('.new_board_btn').replaceWith(clone);
    }

    function deleteBoard(event) {
      const boardID = event.path[1].children[3].children[0].firstElementChild[4].value;
      const board = event.path[1]
      const areYouSure = confirm('This will delete your board, do you wish to continue?')
      if (areYouSure === true) {
        console.log('You deleted the board');
        $.ajax({
          url: 'http://localhost:3000/boards/'+boardID,
          type: 'DELETE',
        }).done(function(responseData) {
          $(board).remove();
        }).fail(function(_jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
          console.log(errorThrown);
        })
      } else {
        console.log('You did not delete the board');
      }
    }

    // making tasks draggable/droppable
    $(function(event) {
        $( taskList ).sortable()
        $( taskList ).disableSelection();
      });

});
