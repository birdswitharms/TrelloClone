// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

document.addEventListener('DOMContentLoaded', function(e) {

const newBoardBtn = document.querySelector('.new_board_btn');
const boardParent = document.querySelector('#parent_board');
const container = document.querySelector('.container');
const boardInput = document.querySelector('#board_form')

newBoardBtn.addEventListener('click', createBoard);

function createBoard() {
  const clone = $('#parent_board').clone().removeClass( 'hidden' ).removeAttr('id');
  const cloneInput = clone[0].children[1].children[0]
  console.dir(cloneInput);
  $(clone).on('submit', function(event) {
    event.preventDefault();
    $.ajax({
    url: '/boards',
    type: 'POST',
    data: $(cloneInput).serialize(),
    dataType: 'JSON'
    }).done(function(responseData) {
      console.log(responseData);
      const div = document.createElement('div')
      $(div).addClass('board')
      const span = document.createElement('span')
      $(span).addClass('board_text')
      span.innerText = responseData.board
      div.appendChild(span)
      container.appendChild(div)
      $(clone).replaceWith(newBoardBtn);
    }).fail(function(_jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
    });
  });
  $('.new_board_btn').replaceWith(clone);
}





});
