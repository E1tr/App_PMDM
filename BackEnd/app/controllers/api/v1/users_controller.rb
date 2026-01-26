module Api
  module V1
    class UsersController < ApplicationController
      before_action :set_user, only: [:show, :update, :destroy]
      before_action :require_admin, only: [:destroy, :index]

      # GET /api/v1/users
      def index
        @users = User.includes(:role).all
        render json: @users.as_json(include: { role: { only: [:id, :name] } })
      end

      # GET /api/v1/users/:id
      def show
        render json: @user.as_json(include: { role: { only: [:id, :name] } })
      end

      # POST /api/v1/users
      def create
        @user = User.new(user_params)
        
        if @user.save
          render json: @user.as_json(include: { role: { only: [:id, :name] } }), status: :created
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/users/:id
      def update
        if @user.update(user_params)
          render json: @user.as_json(include: { role: { only: [:id, :name] } })
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/users/:id
      def destroy
        @user.destroy
        head :no_content
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation, :avatar_url, :role_id)
      end
    end
  end
end
