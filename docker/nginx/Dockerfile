FROM nginx:1.27.2-alpine

# Создаем директорию для сертификатов
WORKDIR /etc/nginx/certs
RUN apk add openssl

# Генерируем ключ и сертификат
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt -subj "/CN=localhost"

# Копируем конфигурационный файл Nginx
COPY conf.d/* /etc/nginx/conf.d/

# Экспозируем порт для HTTPS
EXPOSE 443

# Команда для запуска Nginx
CMD ["nginx", "-g", "daemon off;"]