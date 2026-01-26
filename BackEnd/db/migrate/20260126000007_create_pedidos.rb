class CreatePedidos < ActiveRecord::Migration[7.1]
  def change
    create_table :pedidos do |t|
      t.string :codigo, null: false
      t.references :cliente, null: false, foreign_key: true
      t.references :direccion_entrega, foreign_key: { to_table: :direcciones_cliente }
      t.references :direccion_recogida, foreign_key: { to_table: :direcciones_cliente }
      t.date :fecha_inicio, null: false
      t.date :fecha_fin, null: false
      t.string :estado, null: false, default: 'PENDIENTE_REVISION'
      t.references :creado_por, null: false, foreign_key: { to_table: :users }
      t.text :notas

      t.timestamps
    end

    add_index :pedidos, :codigo, unique: true
    add_index :pedidos, :estado
    add_index :pedidos, :fecha_inicio
    add_index :pedidos, :fecha_fin
  end
end
