FROM php:8.2-apache

# 1. Ativa módulos do Apache se precisar de URLs amigáveis
RUN a2enmod rewrite

# 2. Instala extensões de banco de dados
RUN docker-php-ext-install pdo pdo_mysql

# 3. Define onde o código vai ficar
WORKDIR /var/www/html

# 4. Copia os arquivos (isso inclui a pasta images, scripts e css)
COPY . /var/www/html/

# 5. AJUSTE DE PERMISSÃO (O segredo para o erro Forbidden)
# Garante que o usuário do Apache seja dono de tudo
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html