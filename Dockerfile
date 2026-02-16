FROM php:8.2-apache

# Define o diretório de trabalho padrão do Apache
WORKDIR /var/www/html

# Copia todo o conteúdo da pasta atual para dentro do container
COPY . /var/www/html/

# Dá permissão para o usuário do Apache (www-data) ler os arquivos
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Expõe a porta 80
EXPOSE 80
