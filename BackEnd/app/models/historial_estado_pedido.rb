class HistorialEstadoPedido < ApplicationRecord
  self.table_name = 'historial_estado_pedido'
  
  belongs_to :pedido
  belongs_to :usuario_cambio, class_name: 'User', foreign_key: 'cambiado_por_id'

  validates :estado_nuevo, presence: true
  validates :fecha_cambio, presence: true
end
