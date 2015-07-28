class CreatePins < ActiveRecord::Migration
  
  def change
    create_table :pins do |t|
      t.string :name
      t.string :description
      t.string :url
      t.integer :board_id
      t.timestamps null: false
    end
  end

end