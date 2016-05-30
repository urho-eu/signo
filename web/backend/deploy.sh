#!/bin/bash -x
SRC_DIR="/home/sopi/work/pebble/signo/web/backend"
DST_DIR="/var/www/signo"
TAR_FILE="/tmp/signo.tgz"
SERVER="u2"

tar czvf ${TAR_FILE} -C ${SRC_DIR} .
scp ${TAR_FILE} ${SERVER}:${TAR_FILE}
ssh ${SERVER} "tar xvf ${TAR_FILE} -C ${DST_DIR}"
