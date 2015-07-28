class Board < ActiveRecord::Base
  has_many :pins, dependent: :destroy
  validates :name, presence: true
end

