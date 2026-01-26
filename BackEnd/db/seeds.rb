# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Limpiar datos existentes (solo para desarrollo)
if Rails.env.development?
  puts "Limpiando datos existentes..."
  HistorialEstadoPedido.destroy_all
  TallaLineaPedido.destroy_all
  LineaPedido.destroy_all
  Pedido.destroy_all
  TallaProducto.destroy_all
  Producto.destroy_all
  DireccionCliente.destroy_all
  Cliente.destroy_all
  User.destroy_all
  Role.destroy_all
end

puts "Creando roles..."
role_normal = Role.create!(name: 'NORMAL', description: 'Usuario operativo')
role_admin = Role.create!(name: 'ADMIN', description: 'Administrador del sistema')

puts "Creando usuarios..."
admin = User.create!(
  role: role_admin,
  name: 'Admin Principal',
  email: 'admin@alquilerapp.com',
  password: '123',
  password_confirmation: '123'
)

prueba = User.create!(
  role: role_admin,
  name: 'Prueba',
  email: 'a@a.com',
  password: '123',
  password_confirmation: '123',
  avatar_url: 'https://i.pravatar.cc/150?u=admin'
)

operario = User.create!(
  role: role_normal,
  name: 'Operario 1',
  email: 'operario1@alquilerapp.com',
  password: '123',
  password_confirmation: '123'
)

puts "Creando clientes..."
carlos = Cliente.create!(
  nombre: 'Carlos López',
  telefono: '612000111',
  email: 'carlos@example.com',
  activo: true
)

ana = Cliente.create!(
  nombre: 'Ana Torres',
  telefono: '612000222',
  email: 'ana@example.com',
  activo: true
)

grupo_evento = Cliente.create!(
  nombre: 'Grupo Evento SL',
  nif_cif: 'B12345678',
  telefono: '955000333',
  email: 'contacto@eventosl.com',
  activo: true
)

puts "Creando direcciones de clientes..."
DireccionCliente.create!(
  cliente: carlos,
  alias: 'Casa',
  linea1: 'Calle Mayor 12',
  ciudad: 'Madrid',
  provincia: 'Madrid',
  codigo_postal: '28013',
  pais: 'España',
  es_principal: true
)

DireccionCliente.create!(
  cliente: ana,
  alias: 'Piso',
  linea1: 'Avenida del Sol 88',
  ciudad: 'Valencia',
  provincia: 'Valencia',
  codigo_postal: '46001',
  pais: 'España',
  es_principal: true
)

dir_grupo = DireccionCliente.create!(
  cliente: grupo_evento,
  alias: 'Almacén principal',
  linea1: 'Polígono Norte 4',
  ciudad: 'Sevilla',
  provincia: 'Sevilla',
  codigo_postal: '41001',
  pais: 'España',
  es_principal: true
)

puts "Creando productos..."
casco = Producto.create!(
  nombre: 'Casco de moto',
  descripcion: 'Casco integral homologado',
  precio_dia: 8,
  activo: true
)

traje = Producto.create!(
  nombre: 'Traje de gala',
  descripcion: 'Traje de etiqueta para eventos',
  precio_dia: 12,
  activo: true
)

carpa = Producto.create!(
  nombre: 'Carpa XL',
  descripcion: 'Carpa para eventos exteriores 5x10m',
  precio_dia: 35,
  activo: true
)

puts "Creando tallas de productos..."
# Cascos
casco_m = TallaProducto.create!(producto: casco, codigo_talla: 'M', descripcion: 'Talla M', activo: true)
casco_l = TallaProducto.create!(producto: casco, codigo_talla: 'L', descripcion: 'Talla L', activo: true)

# Trajes
traje_m = TallaProducto.create!(producto: traje, codigo_talla: 'M', descripcion: 'Talla M', activo: true)
traje_l = TallaProducto.create!(producto: traje, codigo_talla: 'L', descripcion: 'Talla L', activo: true)

# Carpa
carpa_xl = TallaProducto.create!(producto: carpa, codigo_talla: 'XL', descripcion: 'Tamaño único XL', activo: true)

puts "Creando pedidos..."
pedido1 = Pedido.create!(
  codigo: 'P-001',
  cliente: carlos,
  direccion_entrega: carlos.direcciones_cliente.first,
  direccion_recogida: carlos.direcciones_cliente.first,
  fecha_inicio: Date.parse('2025-12-10'),
  fecha_fin: Date.parse('2025-12-14'),
  estado: 'PREPARADO',
  creador: operario,
  notas: 'Entrega por la mañana'
)

pedido2 = Pedido.create!(
  codigo: 'P-002',
  cliente: ana,
  direccion_entrega: ana.direcciones_cliente.first,
  direccion_recogida: ana.direcciones_cliente.first,
  fecha_inicio: Date.parse('2025-12-08'),
  fecha_fin: Date.parse('2025-12-11'),
  estado: 'ENTREGADO',
  creador: operario
)

pedido3 = Pedido.create!(
  codigo: 'P-003',
  cliente: grupo_evento,
  direccion_entrega: dir_grupo,
  direccion_recogida: dir_grupo,
  fecha_inicio: Date.parse('2025-12-05'),
  fecha_fin: Date.parse('2025-12-09'),
  estado: 'PENDIENTE_REVISION',
  creador: admin,
  notas: 'Revisar posibles daños en carpa'
)

pedido4 = Pedido.create!(
  codigo: 'P-004',
  cliente: carlos,
  direccion_entrega: carlos.direcciones_cliente.first,
  direccion_recogida: carlos.direcciones_cliente.first,
  fecha_inicio: Date.parse('2025-12-01'),
  fecha_fin: Date.parse('2025-12-03'),
  estado: 'FINALIZADO',
  creador: operario
)

puts "Creando líneas de pedido..."
# Pedido 1 - Carlos
linea1_1 = LineaPedido.create!(
  pedido: pedido1,
  producto: casco,
  precio_dia: 8,
  dias_alquiler: 4,
  cantidad_total: 3,
  importe_linea: 96
)

linea1_2 = LineaPedido.create!(
  pedido: pedido1,
  producto: traje,
  precio_dia: 12,
  dias_alquiler: 4,
  cantidad_total: 2,
  importe_linea: 96
)

# Pedido 2 - Ana
linea2_1 = LineaPedido.create!(
  pedido: pedido2,
  producto: casco,
  precio_dia: 8,
  dias_alquiler: 3,
  cantidad_total: 3,
  importe_linea: 72
)

# Pedido 3 - Grupo Evento
linea3_1 = LineaPedido.create!(
  pedido: pedido3,
  producto: traje,
  precio_dia: 12,
  dias_alquiler: 4,
  cantidad_total: 6,
  importe_linea: 288
)

linea3_2 = LineaPedido.create!(
  pedido: pedido3,
  producto: carpa,
  precio_dia: 35,
  dias_alquiler: 4,
  cantidad_total: 2,
  importe_linea: 280
)

linea3_3 = LineaPedido.create!(
  pedido: pedido3,
  producto: casco,
  precio_dia: 8,
  dias_alquiler: 4,
  cantidad_total: 6,
  importe_linea: 192
)

# Pedido 4 - Carlos (histórico)
linea4_1 = LineaPedido.create!(
  pedido: pedido4,
  producto: casco,
  precio_dia: 8,
  dias_alquiler: 2,
  cantidad_total: 2,
  importe_linea: 32
)

puts "Creando tallas por línea de pedido..."
# Pedido 1, línea 1 (Cascos)
TallaLineaPedido.create!(linea_pedido: linea1_1, talla: casco_m, cantidad: 2)
TallaLineaPedido.create!(linea_pedido: linea1_1, talla: casco_l, cantidad: 1)

# Pedido 1, línea 2 (Trajes)
TallaLineaPedido.create!(linea_pedido: linea1_2, talla: traje_m, cantidad: 1)
TallaLineaPedido.create!(linea_pedido: linea1_2, talla: traje_l, cantidad: 1)

# Pedido 2, línea 1 (Cascos)
TallaLineaPedido.create!(linea_pedido: linea2_1, talla: casco_m, cantidad: 1)
TallaLineaPedido.create!(linea_pedido: linea2_1, talla: casco_l, cantidad: 2)

# Pedido 3, línea 1 (Trajes)
TallaLineaPedido.create!(linea_pedido: linea3_1, talla: traje_m, cantidad: 3)
TallaLineaPedido.create!(linea_pedido: linea3_1, talla: traje_l, cantidad: 3)

# Pedido 3, línea 2 (Carpas)
TallaLineaPedido.create!(linea_pedido: linea3_2, talla: carpa_xl, cantidad: 2)

# Pedido 3, línea 3 (Cascos)
TallaLineaPedido.create!(linea_pedido: linea3_3, talla: casco_m, cantidad: 3)
TallaLineaPedido.create!(linea_pedido: linea3_3, talla: casco_l, cantidad: 3)

# Pedido 4, línea 1 (Cascos)
TallaLineaPedido.create!(linea_pedido: linea4_1, talla: casco_l, cantidad: 2)

puts "✅ Seeds creados exitosamente!"
puts "   - #{Role.count} roles"
puts "   - #{User.count} usuarios"
puts "   - #{Cliente.count} clientes"
puts "   - #{DireccionCliente.count} direcciones"
puts "   - #{Producto.count} productos"
puts "   - #{TallaProducto.count} tallas de productos"
puts "   - #{Pedido.count} pedidos"
puts "   - #{LineaPedido.count} líneas de pedido"
puts "   - #{TallaLineaPedido.count} tallas por línea"
