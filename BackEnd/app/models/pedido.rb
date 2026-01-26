class Pedido < ApplicationRecord
  belongs_to :cliente
  belongs_to :direccion_entrega, class_name: 'DireccionCliente', optional: true
  belongs_to :direccion_recogida, class_name: 'DireccionCliente', optional: true
  belongs_to :creador, class_name: 'User', foreign_key: 'creado_por_id'
  
  has_many :lineas_pedido, class_name: 'LineaPedido', dependent: :destroy
  has_many :historial_estado_pedidos, class_name: 'HistorialEstadoPedido', dependent: :destroy

  validates :codigo, presence: true, uniqueness: true
  validates :fecha_inicio, :fecha_fin, presence: true
  validates :estado, presence: true, inclusion: { in: %w[PREPARADO ENTREGADO DEVUELTO PENDIENTE_REVISION FINALIZADO] }

  validate :fecha_fin_after_fecha_inicio

  before_create :generate_codigo

  def total_importe
    lineas_pedido.sum(:importe_linea)
  end

  def total_unidades
    lineas_pedido.sum(:cantidad_total)
  end

  def cambiar_estado(nuevo_estado, usuario_id, observaciones = nil)
    estado_anterior = self.estado
    self.estado = nuevo_estado
    
    if save
      historial_estado_pedidos.create!(
        estado_anterior: estado_anterior,
        estado_nuevo: nuevo_estado,
        cambiado_por_id: usuario_id,
        fecha_cambio: Time.current,
        observaciones: observaciones
      )
      true
    else
      false
    end
  end

  private

  def fecha_fin_after_fecha_inicio
    return if fecha_fin.blank? || fecha_inicio.blank?

    if fecha_fin < fecha_inicio
      errors.add(:fecha_fin, "debe ser posterior a la fecha de inicio")
    end
  end

  def generate_codigo
    return if codigo.present?
    
    last_pedido = Pedido.order(created_at: :desc).first
    next_number = last_pedido ? last_pedido.codigo.split('-').last.to_i + 1 : 1
    self.codigo = "P-#{next_number.to_s.rjust(3, '0')}"
  end
end
