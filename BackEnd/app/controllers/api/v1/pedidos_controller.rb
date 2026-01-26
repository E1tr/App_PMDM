module Api
  module V1
    class PedidosController < ApplicationController
      before_action :set_pedido, only: [:show, :update, :destroy, :historial, :cambiar_estado]

      # GET /api/v1/pedidos
      def index
        @pedidos = Pedido.includes(:cliente, :lineas_pedido).all
        
        if params[:estado]
          @pedidos = @pedidos.where(estado: params[:estado])
        end
        
        @pedidos = @pedidos.order(fecha_inicio: :desc)
        
        render json: @pedidos.as_json(
          include: {
            cliente: { only: [:id, :nombre] },
            lineas_pedido: {
              include: {
                producto: { only: [:id, :nombre] }
              }
            }
          },
          methods: [:total_importe, :total_unidades]
        )
      end

      # GET /api/v1/pedidos/:id
      def show
        render json: @pedido.as_json(
          include: {
            cliente: {},
            direccion_entrega: {},
            direccion_recogida: {},
            creador: { only: [:id, :name, :email] },
            lineas_pedido: {
              include: {
                producto: {},
                tallas_linea_pedido: {
                  include: {
                    talla: {}
                  }
                }
              }
            }
          },
          methods: [:total_importe, :total_unidades]
        )
      end

      # GET /api/v1/pedidos/:id/historial
      def historial
        @historial = @pedido.historial_estado_pedidos.includes(:usuario_cambio).order(fecha_cambio: :desc)
        render json: @historial.as_json(include: { usuario_cambio: { only: [:id, :name] } })
      end

      # POST /api/v1/pedidos/:id/cambiar_estado
      def cambiar_estado
        nuevo_estado = params[:estado]
        observaciones = params[:observaciones]
        
        if @pedido.cambiar_estado(nuevo_estado, current_user.id, observaciones)
          render json: @pedido
        else
          render json: { errors: @pedido.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/pedidos
      def create
        @pedido = Pedido.new(pedido_params)
        @pedido.creado_por = current_user.id
        
        if @pedido.save
          render json: @pedido, status: :created
        else
          render json: { errors: @pedido.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/pedidos/:id
      def update
        if @pedido.update(pedido_params)
          render json: @pedido
        else
          render json: { errors: @pedido.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/pedidos/:id
      def destroy
        @pedido.destroy
        head :no_content
      end

      private

      def set_pedido
        @pedido = Pedido.find(params[:id])
      end

      def pedido_params
        params.require(:pedido).permit(
          :codigo, :cliente_id, :direccion_entrega_id, :direccion_recogida_id,
          :fecha_inicio, :fecha_fin, :estado, :notas
        )
      end
    end
  end
end
