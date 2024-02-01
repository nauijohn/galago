FROM node:18.16.1-alpine AS production
ENV NODE_ENV production

WORKDIR /app

COPY ./dist /app/dist
COPY ./node_modules /app/node_modules
COPY package.json ./
COPY .env.preprod.server ./

# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 30095
# CMD ["nginx", "-g", "daemon off;"]
CMD ["npm", "run", "start-linux:preprod-server"]

# # Base image
# FROM node:18.16.1-alpine AS development
# ENV NODE_ENV development

# # Create app directory
# # WORKDIR /usr/src/app
# WORKDIR /app

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./

# RUN npm install --legacy-peer-deps

# # Bundle app source
# COPY . .

# # Copy the .env and .env.development files
# COPY .env.* ./

# # Creates a "dist" folder with the production build
# RUN npm run build

# # Expose the port on which the app will run
# EXPOSE 30090

# # Start the server using the production build
# CMD ["npm", "run", "start:dev-server"]
