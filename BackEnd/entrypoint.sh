#!/bin/bash
set -e

# Eliminar el archivo server.pid si existe
rm -f /app/tmp/pids/server.pid

# Ejecutar el comando pasado como argumento
exec "$@"
