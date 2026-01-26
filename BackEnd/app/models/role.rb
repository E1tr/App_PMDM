class Role < ApplicationRecord
  has_many :users

  validates :name, presence: true, uniqueness: true
  validates :name, inclusion: { in: %w[NORMAL ADMIN] }
end
