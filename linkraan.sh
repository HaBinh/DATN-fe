release=$(date "+%Y%m%d%H%M%S")
mv /home/raan/apps/raan/fe/releases/dist /home/raan/apps/raan/fe/releases/${release}
rm /home/raan/apps/raan/fe/current
ln -s /home/raan/apps/raan/fe/releases/${release} /home/raan/apps/raan/fe/current
rm /home/raan/apps/raan/current/public
ln -s $(readlink /home/raan/apps/raan/fe/current) /home/raan/apps/raan/current/public
echo "Deployed as $release"