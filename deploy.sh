#!/bin/sh
local_path=$(dirname $(readlink -f $0))
site_path=~/Documents/ZeroNet/data/1KiwiBCVBUcuypVm8FEmUW9YT6fJDXkN9r
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

rm -rf $site_path
cp -r main/dist/* $site_path

if [ -d data-temp ]; then
	rm -rf $site_path/data
	mv data-temp $site_path/data
fi

echo "Signing"
$zeronet_path siteSign 1KiwiBCVBUcuypVm8FEmUW9YT6fJDXkN9r stored

popd >/dev/null 2>&1