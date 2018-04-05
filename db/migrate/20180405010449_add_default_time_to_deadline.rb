class AddDefaultTimeToDeadline < ActiveRecord::Migration[5.1]
  def change
    change_column :tasks, :deadline, :datetime, :default => Time.now

  end
end
