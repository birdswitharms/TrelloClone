class Board < ApplicationRecord
  validates :name, presence: true
  
  has_many :task
  belongs_to :user

end
