# Beca CIN App

## Docker

### Build image
```bash
docker build --pull --no-cache -t nicostreri/atitool .
```

### Run app
```bash
docker run -v $(pwd)/config:/usr/src/app/config nicostreri/atitool -u https://www.google.com
```