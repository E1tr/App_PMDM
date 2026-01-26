module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :authorize_request, only: [:login, :register]

      # POST /api/v1/auth/login
      def login
        user = User.find_by(email: params[:email])
        if user&.authenticate(params[:password])
          token = JsonWebToken.encode(user_id: user.id)
          render json: {
            token: token,
            user: user.as_json(include: { role: { only: [:id, :name] } })
          }, status: :ok
        else
          render json: { error: 'Invalid credentials' }, status: :unauthorized
        end
      end

      # POST /api/v1/auth/register
      def register
        user = User.new(user_params)
        user.role = Role.find_by(name: 'NORMAL') unless params[:role_id]
        
        if user.save
          token = JsonWebToken.encode(user_id: user.id)
          render json: {
            token: token,
            user: user.as_json(include: { role: { only: [:id, :name] } })
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/auth/me
      def me
        render json: current_user.as_json(include: { role: { only: [:id, :name] } })
      end

      private

      def user_params
        params.permit(:name, :email, :password, :password_confirmation, :avatar_url, :role_id)
      end
    end
  end
end
