#!/bin/sh
site_address=1KiwiBCVBUcuypVm8FEmUW9YT6fJDXkN9r
local_path=$(dirname $(readlink -f $0))
data_path=~/Documents/ZeroNet/data
site_path="$data_path/$site_address"
zeronet_path="py -2 $(echo ~)/Documents/ZeroNet/zeronet.py"

pushd $local_path >/dev/null 2>&1

echo "    ============= Deploy ============="
echo "    Make sure all npm packages are    "
echo "    installed and webpack was ran.    "
echo "    =================================="
echo ""

read -p "Are you sure you want to start deploy? " -n 1 -r
echo
if ! [[ $REPLY =~ ^[Yy]$ ]]; then
	exit
fi

echo "Copying"
if [ -d $site_path/data ]; then
	mv $site_path/data data-temp
fi

if ! [ -d $site_path ]; then
	mkdir $site_path
fi
cp -r main/dist/* $site_path

if [ -d data-temp ]; then
	rm -rf $site_path/data
	mv data-temp $site_path/data
fi

echo "Loading private key"
privatekey=$(cat "$data_path/users.json" | python -c "import json, sys; p = json.load(sys.stdin); p = p[list(p.keys())[0]]; print(p['sites']['$site_address']['privatekey'])")

echo "Signing"
$zeronet_path sitePublish $site_address $privatekey

popd >/dev/null 2>&1