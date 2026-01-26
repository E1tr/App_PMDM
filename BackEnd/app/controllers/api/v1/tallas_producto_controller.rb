module Api
  module V1
    class TallasProductoController < ApplicationController
      before_action :set_producto
      before_action :set_talla, only: [:show, :update, :destroy]

      # GET /api/v1/productos/:producto_id/tallas
      def index
        @tallas = @producto.tallas_producto
        render json: @tallas
      end

      # GET /api/v1/productos/:producto_id/tallas/:id
      def show
        render json: @talla
      end

      # POST /api/v1/productos/:producto_id/tallas
      def create
        @talla = @producto.tallas_producto.new(talla_params)
        
        if @talla.save
          render json: @talla, status: :created
        else
          render json: { errors: @talla.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/productos/:producto_id/tallas/:id
      def update
        if @talla.update(talla_params)
          render json: @talla
        else
          render json: { errors: @talla.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/productos/:producto_id/tallas/:id
      def destroy
        @talla.update(activo: false)
        head :no_content
      end

      private

      def set_producto
        @producto = Producto.find(params[:producto_id])
      end

      def set_talla
        @talla = @producto.tallas_producto.find(params[:id])
      end

      def talla_params
        params.require(:talla_producto).permit(:codigo_talla, :descripcion, :activo)
      end
    end
  end
end
