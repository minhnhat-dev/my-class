FROM haproxy:1.8
RUN  mkdir /run/haproxy \
    && mkdir -p /var/lib/haproxy \
    && mkdir -p  /var/run/haproxy \
    && touch /var/lib/haproxy/stats \
COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg