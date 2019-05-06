release=$(date "+%Y%m%d%H%M%S")
mv /home/namhai/apps/namhai/fe/releases/dist /home/namhai/apps/namhai/fe/releases/${release}
rm /home/namhai/apps/namhai/fe/current
ln -s /home/namhai/apps/namhai/fe/releases/${release} /home/namhai/apps/namhai/fe/current
rm /home/namhai/apps/namhai/current/public
ln -s $(readlink /home/namhai/apps/namhai/fe/current) /home/namhai/apps/namhai/current/public
echo "Deployed as $release"