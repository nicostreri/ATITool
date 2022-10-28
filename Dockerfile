FROM node:16
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
RUN apt-get update -y && apt-get install -y libxshmfence-dev

## Install HTML Code Sniffer
RUN npm install -g https://github.com/nicostreri/Beca-CIN-htmlcsToJSON --unsafe-perm=true

## Install Axe
RUN npm install @axe-core/cli -g --unsafe-perm=true

## Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the source code of the app
COPY ./src ./src
COPY ./bin ./bin
RUN npm link
ENTRYPOINT ["/usr/local/bin/atitool"]