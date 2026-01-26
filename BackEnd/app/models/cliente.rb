class Cliente < ApplicationRecord
  has_many :direcciones_cliente, class_name: 'DireccionCliente', dependent: :destroy
  has_many :pedidos

  validates :nombre, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true

  scope :activos, -> { where(activo: true) }
end
