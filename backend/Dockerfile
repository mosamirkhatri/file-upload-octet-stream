FROM python:3.8-alpine3.15

WORKDIR /app

# RUN apk add --update --no-cache --virtual .tmp-build-deps gcc libc-dev linux-headers \
#     && apk add libffi-dev \
#     && apk add jpeg-dev zlib-dev libjpeg

RUN pip install --upgrade pip

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT ["./run.sh"]

# docker run -p 8000:8000 upload-backend:1.0