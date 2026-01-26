class DireccionCliente < ApplicationRecord
  self.table_name = 'direcciones_cliente'
  
  belongs_to :cliente

  validates :linea1, presence: true

  scope :principales, -> { where(es_principal: true) }
end
