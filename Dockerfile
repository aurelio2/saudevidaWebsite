FROM php:8.2-apache

# Silencia o alerta de ServerName nos logs
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Ativa extensões e permissões (essencial para não dar Forbidden)
RUN docker-php-ext-install pdo pdo_mysql
WORKDIR /var/www/html
COPY . /var/www/html/
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html
