FROM node:13

MAINTAINER Covital Project <http://github.com/covital-project>

ADD . /app

WORKDIR /app

ENV debs python build-essential git-core

RUN apt-get update -q && \
	apt-get install -qy $debs && \
	rm -rf /var/lib/apt/lists/*

RUN npm ci

CMD ["npm", "run", "start"]
