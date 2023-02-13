FROM python:3.10-alpine as build

WORKDIR /src
COPY requirements.txt /src/requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 8082

CMD ["python3", "server.py"]