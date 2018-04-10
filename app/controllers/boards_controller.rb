class BoardsController < ApplicationController
  before_action :load_board, only: [:destroy]

  def index
    @all_boards = current_user.boards
  end

  def new

  end

  def create
    @board = current_user.boards.new(board_params)

    if @board.save
      respond_to do |format|
        format.html do
            render :index
          end
        format.json do
          if request.xhr?
            render json: {board: @board.name}
          end
        end
      end
      puts "** BOARD ** SAVED **"
    else
      puts @board.errors.full_messages
    end
  end

  def update
  end

  def destroy
    if @board.destroy
      puts "*"*20
      @board.task.delete_all
      puts "#{@board}"
      puts "*"*20
    end


  end


  private

  def load_board
    @board = Board.find(params[:id])
  end

  def board_params
    params.require(:boards).permit(:name)
  end


end
