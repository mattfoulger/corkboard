class Pin < ActiveRecord::Base
  belongs_to :board
  validates :board_id, presence: true, numericality: {integer_only: true}
  validates :url, presence: true 
end

