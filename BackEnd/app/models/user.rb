class User < ApplicationRecord
  belongs_to :role
  has_many :pedidos, foreign_key: 'creado_por'
  has_many :historial_estado_pedidos, foreign_key: 'cambiado_por'

  has_secure_password

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  def admin?
    role.name == 'ADMIN'
  end

  def as_json(options = {})
    super(options.merge(except: [:password_digest]))
  end
end
