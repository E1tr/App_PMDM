class TallaProducto < ApplicationRecord
  self.table_name = 'tallas_producto'
  
  belongs_to :producto
  has_many :tallas_linea_pedido, class_name: 'TallaLineaPedido', foreign_key: 'talla_id'

  validates :codigo_talla, presence: true
  validates :codigo_talla, uniqueness: { scope: :producto_id }
  scope :activos, -> { where(activo: true) }
end
