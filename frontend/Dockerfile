# Step 1: Set the base image
FROM node:18 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the rest of the front-end code
COPY . .

# Step 5: Build the front-end project
RUN npm run build

# Step 6: Serve the production build using a static server
FROM nginx:alpine

# Step 7: Copy the build output from the previous step
COPY --from=build /app/build /usr/share/nginx/html

# Step 8: Expose the port (default is 80 for nginx)
EXPOSE 80

# Step 9: Start nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
