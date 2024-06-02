# Use uma imagem Node.js como base
FROM node:latest

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json (ou yarn.lock) para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todos os arquivos do diretório atual para o diretório de trabalho no contêiner
COPY . .

# Copie o script SQL para o diretório de inicialização do MySQL
COPY database/init-db.sql /docker-entrypoint-initdb.d/

# Exponha a porta 3000 para fora do contêiner
EXPOSE 3000

# Comando de inicialização padrão
CMD [ "npm", "run", "start" ]
