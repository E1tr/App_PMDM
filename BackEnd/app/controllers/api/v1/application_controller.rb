module Api
  module V1
    class ApplicationController < ActionController::API
      before_action :authorize_request, except: [:not_found]

      def not_found
        render json: { error: 'not_found' }, status: :not_found
      end

      private

      def authorize_request
        header = request.headers['Authorization']
        header = header.split(' ').last if header
        begin
          @decoded = JsonWebToken.decode(header)
          @current_user = User.find(@decoded[:user_id])
        rescue ActiveRecord::RecordNotFound => e
          render json: { errors: e.message }, status: :unauthorized
        rescue JWT::DecodeError => e
          render json: { errors: e.message }, status: :unauthorized
        end
      end

      def current_user
        @current_user
      end

      def require_admin
        unless current_user&.admin?
          render json: { error: 'Unauthorized' }, status: :forbidden
        end
      end
    end
  end
end
