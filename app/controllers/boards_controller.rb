class BoardsController < ApplicationController
  before_action :load_board, only: [:destroy]

  def index
    if current_user
      @all_boards = current_user.boards
    end
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
            render json: {board: @board.name, id: @board.id}
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
    params.require(:boards).permit(:name, :id)
  end


end
