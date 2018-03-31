class UsersController < ApplicationController

  def new
    @user = User.new
  end

  def create
    @user = User.new(
      name: params[:user][:name],
      email: params[:user][:email],
      password: params[:user][:password],
      password_confirmation: params[:user][:password_confirmation]
    )
    if @user.save
      puts @user.errors.full_messages
      session[:user_id] = @user.id
      redirect_to root_path
    else
      puts @user.errors.full_messages
      flash.now[:alert] = @user.errors.full_messages
      redirect_to root_path
    end
  end

end
