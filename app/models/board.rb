class Board < ApplicationRecord

  has_many :task
  belongs_to :user

end
