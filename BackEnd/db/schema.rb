# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_01_26_000010) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "clientes", force: :cascade do |t|
    t.string "nombre", null: false
    t.string "nif_cif"
    t.string "telefono"
    t.string "email"
    t.text "notas"
    t.boolean "activo", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["activo"], name: "index_clientes_on_activo"
    t.index ["email"], name: "index_clientes_on_email"
  end

  create_table "direcciones_cliente", force: :cascade do |t|
    t.bigint "cliente_id", null: false
    t.string "alias"
    t.string "linea1", null: false
    t.string "linea2"
    t.string "ciudad"
    t.string "provincia"
    t.string "codigo_postal"
    t.string "pais"
    t.decimal "latitud", precision: 10, scale: 8
    t.decimal "longitud", precision: 11, scale: 8
    t.boolean "es_principal", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cliente_id"], name: "index_direcciones_cliente_on_cliente_id"
  end

  create_table "historial_estado_pedido", force: :cascade do |t|
    t.bigint "pedido_id", null: false
    t.string "estado_anterior"
    t.string "estado_nuevo", null: false
    t.bigint "cambiado_por_id", null: false
    t.datetime "fecha_cambio", null: false
    t.text "observaciones"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cambiado_por_id"], name: "index_historial_estado_pedido_on_cambiado_por_id"
    t.index ["fecha_cambio"], name: "index_historial_estado_pedido_on_fecha_cambio"
    t.index ["pedido_id"], name: "index_historial_estado_pedido_on_pedido_id"
  end

  create_table "lineas_pedido", force: :cascade do |t|
    t.bigint "pedido_id", null: false
    t.bigint "producto_id", null: false
    t.decimal "precio_dia", precision: 10, scale: 2, null: false
    t.integer "dias_alquiler", null: false
    t.integer "cantidad_total", null: false
    t.decimal "importe_linea", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["pedido_id"], name: "index_lineas_pedido_on_pedido_id"
    t.index ["producto_id"], name: "index_lineas_pedido_on_producto_id"
  end

  create_table "pedidos", force: :cascade do |t|
    t.string "codigo", null: false
    t.bigint "cliente_id", null: false
    t.bigint "direccion_entrega_id"
    t.bigint "direccion_recogida_id"
    t.date "fecha_inicio", null: false
    t.date "fecha_fin", null: false
    t.string "estado", default: "PENDIENTE_REVISION", null: false
    t.bigint "creado_por_id", null: false
    t.text "notas"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cliente_id"], name: "index_pedidos_on_cliente_id"
    t.index ["codigo"], name: "index_pedidos_on_codigo", unique: true
    t.index ["creado_por_id"], name: "index_pedidos_on_creado_por_id"
    t.index ["direccion_entrega_id"], name: "index_pedidos_on_direccion_entrega_id"
    t.index ["direccion_recogida_id"], name: "index_pedidos_on_direccion_recogida_id"
    t.index ["estado"], name: "index_pedidos_on_estado"
    t.index ["fecha_fin"], name: "index_pedidos_on_fecha_fin"
    t.index ["fecha_inicio"], name: "index_pedidos_on_fecha_inicio"
  end

  create_table "productos", force: :cascade do |t|
    t.string "nombre", null: false
    t.text "descripcion"
    t.decimal "precio_dia", precision: 10, scale: 2, null: false
    t.boolean "activo", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["activo"], name: "index_productos_on_activo"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_roles_on_name", unique: true
  end

  create_table "tallas_linea_pedido", force: :cascade do |t|
    t.bigint "linea_pedido_id", null: false
    t.bigint "talla_id", null: false
    t.integer "cantidad", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["linea_pedido_id", "talla_id"], name: "index_tallas_linea_pedido_on_linea_pedido_id_and_talla_id", unique: true
    t.index ["linea_pedido_id"], name: "index_tallas_linea_pedido_on_linea_pedido_id"
    t.index ["talla_id"], name: "index_tallas_linea_pedido_on_talla_id"
  end

  create_table "tallas_producto", force: :cascade do |t|
    t.bigint "producto_id", null: false
    t.string "codigo_talla", null: false
    t.string "descripcion"
    t.boolean "activo", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["producto_id", "codigo_talla"], name: "index_tallas_producto_on_producto_id_and_codigo_talla", unique: true
    t.index ["producto_id"], name: "index_tallas_producto_on_producto_id"
  end

  create_table "users", force: :cascade do |t|
    t.bigint "role_id", null: false
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest"
    t.string "avatar_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["role_id"], name: "index_users_on_role_id"
  end

  add_foreign_key "direcciones_cliente", "clientes"
  add_foreign_key "historial_estado_pedido", "pedidos"
  add_foreign_key "historial_estado_pedido", "users", column: "cambiado_por_id"
  add_foreign_key "lineas_pedido", "pedidos"
  add_foreign_key "lineas_pedido", "productos"
  add_foreign_key "pedidos", "clientes"
  add_foreign_key "pedidos", "direcciones_cliente", column: "direccion_entrega_id"
  add_foreign_key "pedidos", "direcciones_cliente", column: "direccion_recogida_id"
  add_foreign_key "pedidos", "users", column: "creado_por_id"
  add_foreign_key "tallas_linea_pedido", "lineas_pedido", column: "linea_pedido_id"
  add_foreign_key "tallas_linea_pedido", "tallas_producto", column: "talla_id"
  add_foreign_key "tallas_producto", "productos"
  add_foreign_key "users", "roles"
end
