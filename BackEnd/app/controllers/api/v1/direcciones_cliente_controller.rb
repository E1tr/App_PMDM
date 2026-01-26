module Api
  module V1
    class DireccionesClienteController < ApplicationController
      before_action :set_cliente
      before_action :set_direccion, only: [:show, :update, :destroy]

      # GET /api/v1/clientes/:cliente_id/direcciones
      def index
        @direcciones = @cliente.direcciones_cliente
        render json: @direcciones
      end

      # GET /api/v1/clientes/:cliente_id/direcciones/:id
      def show
        render json: @direccion
      end

      # POST /api/v1/clientes/:cliente_id/direcciones
      def create
        @direccion = @cliente.direcciones_cliente.new(direccion_params)
        
        if @direccion.save
          render json: @direccion, status: :created
        else
          render json: { errors: @direccion.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/clientes/:cliente_id/direcciones/:id
      def update
        if @direccion.update(direccion_params)
          render json: @direccion
        else
          render json: { errors: @direccion.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/clientes/:cliente_id/direcciones/:id
      def destroy
        @direccion.destroy
        head :no_content
      end

      private

      def set_cliente
        @cliente = Cliente.find(params[:cliente_id])
      end

      def set_direccion
        @direccion = @cliente.direcciones_cliente.find(params[:id])
      end

      def direccion_params
        params.require(:direccion_cliente).permit(
          :alias, :linea1, :linea2, :ciudad, :provincia, 
          :codigo_postal, :pais, :latitud, :longitud, :es_principal
        )
      end
    end
  end
end
