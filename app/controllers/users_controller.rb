class UsersController < ApplicationController

  def new
    @user = User.new
  end

  def create
    @user = User.new
      (
      name = params[:user][:name],
      email = params[:user][:email],
      password = params[:user][:password],
      password_confirmation = params[:user][:password_confirmation]
      )
    if @user.save
      session[:user_id] = @user.id
      redirect_to root_path
    else
      flash.now[:alert] = @user.errors.full_messages
      redirect_to root_path
    end
  end

end
