class CreateProductos < ActiveRecord::Migration[7.1]
  def change
    create_table :productos do |t|
      t.string :nombre, null: false
      t.text :descripcion
      t.decimal :precio_dia, precision: 10, scale: 2, null: false
      t.boolean :activo, default: true, null: false

      t.timestamps
    end

    add_index :productos, :activo
  end
end
