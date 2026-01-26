class CreateHistorialEstadoPedido < ActiveRecord::Migration[7.1]
  def change
    create_table :historial_estado_pedido do |t|
      t.references :pedido, null: false, foreign_key: true
      t.string :estado_anterior
      t.string :estado_nuevo, null: false
      t.references :cambiado_por, null: false, foreign_key: { to_table: :users }
      t.datetime :fecha_cambio, null: false
      t.text :observaciones

      t.timestamps
    end

    add_index :historial_estado_pedido, :fecha_cambio
  end
end
