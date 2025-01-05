# 1. Usa una imagen base con Node.js
FROM node:22.12

# 2. Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copia los archivos de tu proyecto al contenedor
COPY package*.json ./
COPY . .

# 4. Instala las dependencias
RUN npm install

# 5. Expone el puerto que usa tu aplicación
EXPOSE 3000

# 6. Define el comando para iniciar la aplicación
CMD ["npm", "start"]
