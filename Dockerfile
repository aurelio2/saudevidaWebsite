FROM php:8.2-apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
WORKDIR /var/www/html
COPY . /var/www/html/
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html
