# .devcontainer/Dockerfile
FROM mcr.microsoft.com/devcontainers/php:8.4

# Yarn リポジトリを削除（ベースイメージに含まれるが GPG 鍵が無く apt-get update が失敗するため）
RUN rm -f /etc/apt/sources.list.d/yarn.list

# 必要なパッケージのインストール
RUN apt-get update \
    && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zlib1g-dev \
    libmcrypt-dev \
    libxi6 \
    curl \
    git \
    unzip \
    vim \
    gnupg \
    libreoffice \
    fonts-ipafont-gothic \
    libicu-dev \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# PHPの拡張モジュールをインストール
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo_mysql bcmath zip intl

# Node.js インストール（20系）
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs git unzip wget \
    && npm install -g npm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# GitHub CLI のインストール
RUN mkdir -p -m 755 /etc/apt/keyrings \
    && wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
    && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install -y gh \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Claude CLI のインストール
RUN npm install -g @anthropic-ai/claude-code

WORKDIR /workspace
