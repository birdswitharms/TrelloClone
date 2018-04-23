class TasksController < ApplicationController

  before_action :find_task, only: [:update, :index, :show]
  before_action :find_todos, only: [:show]

  def show
    puts @todos
    respond_to do |format|
      format.html do
        puts "responded to html"
        end
      format.json do
        if request.xhr?
          render json:
          @todos.each do |todo|
            {id: todo.id, name: todo.name, deadline: todo.deadline, task: todo.task}
          end
        end
      end
    end
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
            render json: {task: @task.name, id: @task.id}
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
          render json: params
        end
      end
    end
    puts "*"*20
  end

  def edit
    puts params
  end

  private

  def find_todos
    @todos = Todo.all.where(:task_id => @task.id)
  end

  def task_params
    params.require(:tasks).permit(:name, :board_id)
  end

  def find_task
    @task = Task.find(params[:id])
  end

end
