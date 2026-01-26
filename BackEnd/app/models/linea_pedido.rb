class LineaPedido < ApplicationRecord
  self.table_name = 'lineas_pedido'
  
  belongs_to :pedido
  belongs_to :producto
  has_many :tallas_linea_pedido, class_name: 'TallaLineaPedido', dependent: :destroy

  validates :precio_dia, :dias_alquiler, :cantidad_total, :importe_linea, presence: true
  validates :precio_dia, :importe_linea, numericality: { greater_than_or_equal_to: 0 }
  validates :dias_alquiler, :cantidad_total, numericality: { greater_than: 0, only_integer: true }

  before_validation :calculate_importe_linea, if: :should_calculate_importe?

  private

  def should_calculate_importe?
    precio_dia.present? && dias_alquiler.present? && cantidad_total.present?
  end

  def calculate_importe_linea
    self.importe_linea = precio_dia * dias_alquiler * cantidad_total
  end
end
