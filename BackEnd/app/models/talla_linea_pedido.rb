class TallaLineaPedido < ApplicationRecord
  self.table_name = 'tallas_linea_pedido'
  
  belongs_to :linea_pedido, class_name: 'LineaPedido'
  belongs_to :talla, class_name: 'TallaProducto'

  validates :cantidad, presence: true, numericality: { greater_than: 0, only_integer: true }
  validates :talla_id, uniqueness: { scope: :linea_pedido_id }
end
