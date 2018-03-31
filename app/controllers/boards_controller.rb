class BoardsController < ApplicationController
  def index
    @all_boards = current_user.boards
  end

  def new

  end

  def create
    @board = current_user.boards.new(board_params)

    if @board.save
      puts "** BOARD ** SAVED **"
      redirect_to root_path
    else
      puts @board.errors.full_messages
    end
  end

  def update
  end

  def delete
  end

  private

  def load_board
    @board = Board.find(params[:id])
  end

  def board_params
    params.require(:boards).permit(:name)
  end


end
