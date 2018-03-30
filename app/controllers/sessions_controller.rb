class SessionsController < ApplicationController
  def create
      @user = User.find_by(name: params[:name])

      if @user && @user.authenticate(params[:password])
        session[:user_id] = @user.id
        redirect_to root_path
      else
        flash.now[:alert] = ["Login failed, name and/or password are incorrect"]
        redirect_to root_path
      end
    end

    def destroy
      session[:user_id] = nil
      redirect_to root_path
    end
end
