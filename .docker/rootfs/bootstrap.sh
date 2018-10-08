#!/usr/bin/env sh

# ensure required directories exists
mkdir -p /etc/service
mkdir -p /etc/bootstrap

# bootstrap must have at least one executable file or "for" loop will fail
echo "echo \":: Hello from Snail, The Node Container!\"" > /etc/bootstrap/0-snail.sh

# ensure everything is executable
chmod +x /etc/service -R
chmod +x /etc/bootstrap -R

ls -la /etc/bootstrap

# execute all bootstrap scripts; the should NOT execute services as they will be executed
# and maintained by runit init service
for script in /etc/bootstrap/*; do
	$script
    status=$?
    if [ $status != 0 ]; then
        echo >&2 "$script: failed with return value $?"
        exit $status
    fi
done

# execute PID 1 init service
exec /sbin/runsvdir -P /etc/service
