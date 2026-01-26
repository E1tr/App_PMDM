class CreateDireccionesCliente < ActiveRecord::Migration[7.1]
  def change
    create_table :direcciones_cliente do |t|
      t.references :cliente, null: false, foreign_key: true
      t.string :alias
      t.string :linea1, null: false
      t.string :linea2
      t.string :ciudad
      t.string :provincia
      t.string :codigo_postal
      t.string :pais
      t.decimal :latitud, precision: 10, scale: 8
      t.decimal :longitud, precision: 11, scale: 8
      t.boolean :es_principal, default: false, null: false

      t.timestamps
    end
  end
end
