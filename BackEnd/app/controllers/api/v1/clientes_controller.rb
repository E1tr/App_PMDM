module Api
  module V1
    class ClientesController < ApplicationController
      before_action :set_cliente, only: [:show, :update, :destroy, :pedidos]

      # GET /api/v1/clientes
      def index
        @clientes = params[:activo] == 'true' ? Cliente.activos : Cliente.all
        render json: @clientes
      end

      # GET /api/v1/clientes/:id
      def show
        render json: @cliente.as_json(include: :direcciones_cliente)
      end

      # GET /api/v1/clientes/:id/pedidos
      def pedidos
        @pedidos = @cliente.pedidos.includes(:cliente, :lineas_pedido)
                          .order(fecha_inicio: :desc)
                          .limit(5)
        
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

      # POST /api/v1/clientes
      def create
        @cliente = Cliente.new(cliente_params)
        
        if @cliente.save
          render json: @cliente, status: :created
        else
          render json: { errors: @cliente.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/clientes/:id
      def update
        if @cliente.update(cliente_params)
          render json: @cliente
        else
          render json: { errors: @cliente.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/clientes/:id
      def destroy
        @cliente.update(activo: false)
        head :no_content
      end

      private

      def set_cliente
        @cliente = Cliente.find(params[:id])
      end

      def cliente_params
        params.require(:cliente).permit(:nombre, :nif_cif, :telefono, :email, :notas, :activo)
      end
    end
  end
end
