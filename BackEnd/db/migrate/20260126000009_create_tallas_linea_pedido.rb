class CreateTallasLineaPedido < ActiveRecord::Migration[7.1]
  def change
    create_table :tallas_linea_pedido do |t|
      t.references :linea_pedido, null: false, foreign_key: { to_table: :lineas_pedido }
      t.references :talla, null: false, foreign_key: { to_table: :tallas_producto }
      t.integer :cantidad, null: false

      t.timestamps
    end

    add_index :tallas_linea_pedido, [:linea_pedido_id, :talla_id], unique: true
  end
end
