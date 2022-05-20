FROM node:10
WORKDIR /usr/src/app

## Install Chrome to force install Chrome dependencies
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

## Install HTML Code Sniffer
RUN npm install -g https://github.com/nicostreri/Beca-CIN-htmlcsToJSON --unsafe-perm=true

## Install app dependencies
COPY package*.json ./
RUN npm install

## Downgrade Chrome for aXe compatibility
ENV CHROME_VERSION=101.0.4951.64-1
RUN wget --no-check-certificate https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}_amd64.deb
RUN dpkg -i google-chrome-stable_${CHROME_VERSION}_amd64.deb || apt -y -f install
RUN rm google-chrome-stable_${CHROME_VERSION}_amd64.deb;

## Install aXe
RUN npm install @axe-core/cli@4.4.2 -g --unsafe-perm=true

# Copy the source code of the app
COPY . .
RUN npm link
ENTRYPOINT ["/usr/local/bin/myapp"]