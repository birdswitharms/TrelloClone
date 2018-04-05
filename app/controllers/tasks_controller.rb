class TasksController < ApplicationController

  before_action :find_task, only: [:update]

  def index

  end

  def new

  end

  def create
    @task = Board.find(params[:board_id]).task.new
    @task.update(name: params[:name], board_id: params[:board_id])

    if @task.save
      respond_to do |format|
        format.html do
          redirect_to root_path
          end
        format.json do
          if request.xhr?
            render json: {task: @task.name}
          end
        end
      end
      puts "**SAVED**"
    else
      puts "**FAILED**"
      puts @task.errors.full_messages
      redirect_to root_path
    end
  end

  def update
    @task.update(completed: params[:task][:completed], deadline: params[:datepicker])

    puts "*"*20
    respond_to do |format|
      format.html do
        redirect_to root_path
        end
      format.json do
        if request.xhr?
          render json: {completed: params[:task][:completed], date: params[:datepicker]}
        end
      end
    end
    puts "*"*20
  end

  def edit
    puts params
  end

  private

  def task_params
    params.require(:tasks).permit(:name, :board_id)
  end

  def find_task
    @task = Task.find(params[:id])
  end

end
