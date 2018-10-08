FROM alpine:3.8

ENV LANG="en_US.UTF-8" \
    LANGUAGE="en_US:en" \
    LC_ALL="en_US.UTF-8" \
    NODE_ENV="production" \
    APP_ROOT=/edde-js-ssr

RUN apk --update upgrade && apk add --no-cache \
	runit curl ca-certificates unzip bash gettext git tzdata busybox-extras nodejs npm yarn util-linux python && \
	npm i -g npm

COPY .docker/rootfs/ /

RUN cp /usr/share/zoneinfo/UTC /etc/localtime

RUN chmod +x /bootstrap.sh
ENTRYPOINT ["/bootstrap.sh"]

WORKDIR /edde-js-ssr
COPY . .
RUN chmod +x *.sh

VOLUME ["/etc/bootstrap", "/etc/service"]
