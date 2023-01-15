FROM nginx:1.23.2-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

COPY dist /usr/share/nginx/html

# docker run -p 8080:80 upload-frontend:1.0