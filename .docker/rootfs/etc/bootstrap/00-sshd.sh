#!/usr/bin/env bash
set -e

if [ -v APP_USE_SSHD ]; then
	apk -U add openssh
	echo "${APP_ROOT_PASSWORD}" | chpasswd
	chmod 600 -R /etc/ssh
	mkdir -p /etc/service/sshd
	cp /etc/service/sshd.sh.template /etc/service/sshd/run
fi
