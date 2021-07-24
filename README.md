# Beca CIN App

## Docker

### Build image
```bash
docker build -t nicostreri/appcin .
```

### Run app
```bash
docker run -v $(pwd)/config:/usr/src/app/config nicostreri/appcin -u https://www.google.com
```