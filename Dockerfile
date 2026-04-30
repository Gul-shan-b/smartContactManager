FROM nginx:alpine
# Copy the static website files to the default Nginx web root directory
COPY . /usr/share/nginx/html

# Expose port 80 inside the container
EXPOSE 80
