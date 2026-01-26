FROM ruby:3.2.2-slim

# Instalar dependencias del sistema
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    postgresql-client \
    build-essential \
    libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Crear directorio de la aplicación
WORKDIR /app

# Copiar Gemfile
COPY Gemfile ./

# Instalar las gemas
RUN bundle install --retry=3

# Copiar el resto de la aplicación
COPY . .

# Crear directorio tmp/pids
RUN mkdir -p tmp/pids log

# Exponer el puerto 3000
EXPOSE 3000

# Script de inicio
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# Comando por defecto
CMD ["rails", "server", "-b", "0.0.0.0"]

# Comando por defecto
CMD ["rails", "server", "-b", "0.0.0.0"]
