# .devcontainer/Dockerfile
FROM mcr.microsoft.com/devcontainers/php:8.4

# Node.js インストール（20系）
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs git unzip \
    && npm install -g npm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Claude CLI のインストール
RUN npm install -g @anthropic-ai/claude-code

WORKDIR /workspace
