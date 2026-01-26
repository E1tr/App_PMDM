module Api
  module V1
    class TallasLineaPedidoController < ApplicationController
      before_action :set_linea_pedido

      # GET /api/v1/pedidos/:pedido_id/lineas/:linea_id/tallas_linea
      def index
        @tallas_linea = @linea_pedido.tallas_linea_pedido.includes(:talla)
        render json: @tallas_linea.as_json(include: :talla)
      end

      # POST /api/v1/pedidos/:pedido_id/lineas/:linea_id/tallas_linea
      def create
        @talla_linea = @linea_pedido.tallas_linea_pedido.new(talla_linea_params)
        
        if @talla_linea.save
          render json: @talla_linea, status: :created
        else
          render json: { errors: @talla_linea.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/pedidos/:pedido_id/lineas/:linea_id/tallas_linea/:id
      def destroy
        @talla_linea = @linea_pedido.tallas_linea_pedido.find(params[:id])
        @talla_linea.destroy
        head :no_content
      end

      private

      def set_linea_pedido
        @linea_pedido = LineaPedido.find(params[:linea_id])
      end

      def talla_linea_params
        params.require(:talla_linea_pedido).permit(:talla_id, :cantidad)
      end
    end
  end
end
