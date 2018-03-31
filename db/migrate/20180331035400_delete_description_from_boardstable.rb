class DeleteDescriptionFromBoardstable < ActiveRecord::Migration[5.1]
  def change
    remove_column :boards, :description
  end
end
