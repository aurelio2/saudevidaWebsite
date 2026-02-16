FROM php:8.2-apache

# Instala extensões básicas de PHP se precisar no futuro
RUN docker-php-ext-install pdo pdo_mysql

# Copia os arquivos do seu projeto (index.php, css, js) para dentro do servidor
COPY . /var/www/html/

# Dá permissão para o Apache ler os arquivos
RUN chown -R www-data:www-data /var/www/html