module Api
  module V1
    class RolesController < ApplicationController
      # GET /api/v1/roles
      def index
        @roles = Role.all
        render json: @roles
      end

      # GET /api/v1/roles/:id
      def show
        @role = Role.find(params[:id])
        render json: @role
      end
    end
  end
end
