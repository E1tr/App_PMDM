module Api
  module V1
    class LineasPedidoController < ApplicationController
      before_action :set_pedido
      before_action :set_linea, only: [:show, :update, :destroy]

      # GET /api/v1/pedidos/:pedido_id/lineas
      def index
        @lineas = @pedido.lineas_pedido.includes(:producto, :tallas_linea_pedido)
        render json: @lineas.as_json(
          include: {
            producto: {},
            tallas_linea_pedido: {
              include: { talla: {} }
            }
          }
        )
      end

      # GET /api/v1/pedidos/:pedido_id/lineas/:id
      def show
        render json: @linea.as_json(
          include: {
            producto: {},
            tallas_linea_pedido: {
              include: { talla: {} }
            }
          }
        )
      end

      # POST /api/v1/pedidos/:pedido_id/lineas
      def create
        @linea = @pedido.lineas_pedido.new(linea_params)
        
        # Copiar el precio del producto si no se proporciona
        @linea.precio_dia ||= @linea.producto.precio_dia if @linea.producto
        
        if @linea.save
          render json: @linea, status: :created
        else
          render json: { errors: @linea.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/pedidos/:pedido_id/lineas/:id
      def update
        if @linea.update(linea_params)
          render json: @linea
        else
          render json: { errors: @linea.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/pedidos/:pedido_id/lineas/:id
      def destroy
        @linea.destroy
        head :no_content
      end

      private

      def set_pedido
        @pedido = Pedido.find(params[:pedido_id])
      end

      def set_linea
        @linea = @pedido.lineas_pedido.find(params[:id])
      end

      def linea_params
        params.require(:linea_pedido).permit(:producto_id, :precio_dia, :dias_alquiler, :cantidad_total, :importe_linea)
      end
    end
  end
end
