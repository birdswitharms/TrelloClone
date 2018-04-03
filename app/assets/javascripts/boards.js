// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

document.addEventListener('DOMContentLoaded', function(e) {

const newBoardBtn = document.querySelector('.new_board_btn');
const boardParent = document.querySelector('#parent_board');
const container = document.querySelector('.container');
const boardCancel = document.querySelector('.board_cancel');
const boardInput = document.querySelector('#board_form');
const taskBtn = document.querySelectorAll('.task_btn')

newBoardBtn.addEventListener('click', createBoard);

for (var i = 0; i < taskBtn.length; i++) {
  taskBtn[i].addEventListener('click', createTask)
}

function cancelBoard() {
  const thisBoard = this.parentNode.parentNode.parentNode
  $(thisBoard).replaceWith(newBoardBtn);
}

function createTask() {
  const taskInput = document.createElement('input');
  const taskSubmit = document.createElement('input');
  taskSubmit.type = 'submit'
  $(taskSubmit).addClass('task_submit')
  $(taskInput).addClass('task_input');
  console.dir(this.parentNode.children);
  const taskDiv = this.parentNode.children[1];
  taskDiv.appendChild(taskInput);
  taskDiv.appendChild(taskSubmit);
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
      const taskBtn = document.createElement('div')
      const taskDiv = document.createElement('div')
      const taskSpan = document.createElement('span')
      $(boardDiv).addClass('board')
      $(boardSpan).addClass('board_text')
      $(taskDiv).addClass('task_div')
      $(taskBtn).addClass('task_btn')
      $(taskSpan).addClass('btn_text')
      taskSpan.innerText = 'new task'
      boardSpan.innerText = responseData.board
      taskBtn.appendChild(taskSpan);
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
