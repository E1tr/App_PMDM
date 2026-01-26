class CreateLineasPedido < ActiveRecord::Migration[7.1]
  def change
    create_table :lineas_pedido do |t|
      t.references :pedido, null: false, foreign_key: true
      t.references :producto, null: false, foreign_key: true
      t.decimal :precio_dia, precision: 10, scale: 2, null: false
      t.integer :dias_alquiler, null: false
      t.integer :cantidad_total, null: false
      t.decimal :importe_linea, precision: 10, scale: 2, null: false

      t.timestamps
    end
  end
end
