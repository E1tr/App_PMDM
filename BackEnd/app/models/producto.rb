class Producto < ApplicationRecord
  has_many :tallas_producto, class_name: 'TallaProducto', dependent: :destroy
  has_many :lineas_pedido, class_name: 'LineaPedido'

  validates :nombre, presence: true
  validates :precio_dia, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :activos, -> { where(activo: true) }
end
