class Task < ApplicationRecord
  validates :name, presence: true

  belongs_to :board
  has_many :todo

end
