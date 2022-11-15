FROM php:7.4-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    zip \
    unzip \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    gnupg2 \
    iputils-ping

# Install PHP extensions
# RUN pecl install \
#     redis 

RUN docker-php-ext-install \
    pdo \
    mbstring \
    exif \
    mysqli \
    pdo \
    pdo_mysql \
    sockets

# Enable extensions
# RUN docker-php-ext-enable redis && \
#     docker-php-ext-enable pdo_sqlsrv

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy and configuration for Apache
COPY ./docker/apache/apache.conf /etc/apache2/sites-available/
RUN a2dissite * && a2ensite apache && a2enmod rewrite

# Workaround on openssl - TCP Provider: Error code 0x2746
# https://stackoverflow.com/questions/57265913/error-tcp-provider-error-code-0x2746-during-the-sql-setup-in-linux-through-te
# RUN sed -i -E 's/(CipherString\s*=\s*DEFAULT@SECLEVEL=)2/\11/' /etc/ssl/openssl.cnf

# Edit a few PHP configurations
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini" && \
    /bin/sed -i -e 's/max_input_time = 60/max_input_time = 600/g' $PHP_INI_DIR/php.ini && \
    /bin/sed -i -e 's/max_execution_time = 30/max_execution_time = 240/g' $PHP_INI_DIR/php.ini && \
    /bin/sed -i -e 's/post_max_size = 8M/post_max_size = 128M/g' $PHP_INI_DIR/php.ini && \
    /bin/sed -i -e 's/upload_max_filesize = 2M/upload_max_filesize = 64M/g' /$PHP_INI_DIR/php.ini && \
    /bin/sed -i -e 's/max_file_uploads = 20/max_file_uploads = 100/g' $PHP_INI_DIR/php.ini && \
    /bin/sed -i -e 's/memory_limit = 128M/memory_limit = 1024M/g' $PHP_INI_DIR/php.ini

# Copy the Laravel project
COPY --chown=www-data:www-data . /var/www/pagespeed

# Set the Workdir
WORKDIR /var/www/pagespeed

# Composer
RUN curl -L https://github.com/composer/composer/releases/download/2.1.9/composer.phar > composer.phar && \
    mv ./composer.phar /usr/local/bin/composer && \
    chmod +x /usr/local/bin/composer && \
    composer install

# Chown again to fix all composer dependencies
RUN chown www-data:www-data -R /var/www/pagespeed && \
    chmod -R 775 /var/www/pagespeed/storage && \
    chmod -R 775 /var/www/pagespeed/bootstrap/cache

EXPOSE 80
