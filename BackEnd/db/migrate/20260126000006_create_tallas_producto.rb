class CreateTallasProducto < ActiveRecord::Migration[7.1]
  def change
    create_table :tallas_producto do |t|
      t.references :producto, null: false, foreign_key: true
      t.string :codigo_talla, null: false
      t.string :descripcion
      t.boolean :activo, default: true, null: false

      t.timestamps
    end

    add_index :tallas_producto, [:producto_id, :codigo_talla], unique: true
  end
end
