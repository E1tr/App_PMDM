class CreateClientes < ActiveRecord::Migration[7.1]
  def change
    create_table :clientes do |t|
      t.string :nombre, null: false
      t.string :nif_cif
      t.string :telefono
      t.string :email
      t.text :notas
      t.boolean :activo, default: true, null: false

      t.timestamps
    end

    add_index :clientes, :email
    add_index :clientes, :activo
  end
end
