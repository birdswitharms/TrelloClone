class UpdateTaskTable < ActiveRecord::Migration[5.1]
  def change
    remove_column :tasks, :est_time
    add_column :tasks, :completed, :boolean, :null => false, :default => false
  end
end
