FROM python:3
WORKDIR /app

# install nginx
RUN apt-get update && \
    apt-get -y install wget gnupg && \
    wget https://nginx.org/keys/nginx_signing.key && \
    cat nginx_signing.key | apt-key add - && \
    apt-get update && \
    apt-get -y install build-essential libpq-dev nginx supervisor && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN ["pip", "install", "-r", "requirements.txt"]
COPY . .
RUN ["mv", "nginx.conf", "/etc/nginx/conf.d/biopath_nginx.conf"]
EXPOSE 80
ENTRYPOINT ["/bin/bash", "/app/startup.sh"]
