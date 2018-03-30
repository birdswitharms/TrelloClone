class Task < ApplicationRecord

  belongs_to :board
  has_many :todo

end
