module Api
  module V1
    class ProductosController < ApplicationController
      before_action :set_producto, only: [:show, :update, :destroy]

      # GET /api/v1/productos
      def index
        @productos = params[:activo] == 'true' ? Producto.activos : Producto.all
        render json: @productos.as_json(include: :tallas_producto)
      end

      # GET /api/v1/productos/:id
      def show
        render json: @producto.as_json(include: :tallas_producto)
      end

      # POST /api/v1/productos
      def create
        @producto = Producto.new(producto_params)
        
        if @producto.save
          render json: @producto, status: :created
        else
          render json: { errors: @producto.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/productos/:id
      def update
        if @producto.update(producto_params)
          render json: @producto
        else
          render json: { errors: @producto.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/productos/:id
      def destroy
        @producto.update(activo: false)
        head :no_content
      end

      private

      def set_producto
        @producto = Producto.find(params[:id])
      end

      def producto_params
        params.require(:producto).permit(:nombre, :descripcion, :precio_dia, :activo)
      end
    end
  end
end
