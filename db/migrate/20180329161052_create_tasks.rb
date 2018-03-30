class CreateTasks < ActiveRecord::Migration[5.1]
  def change
    create_table :tasks do |t|
      t.string :name
      t.datetime :est_time
      t.datetime :deadline
      t.references :board, foreign_key: true
      t.timestamps
    end
  end
end
