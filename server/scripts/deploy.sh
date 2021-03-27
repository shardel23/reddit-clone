#!/bin/bash

echo What version?
read VERSION

docker build -t shardel23/lireddit:$VERSION .
docker push shardel23/lireddit:$VERSION

ssh -i ~/.ssh/id_rsa2 root@206.189.110.101 "docker pull shardel23/lireddit:$VERSION && docker tag shardel23/lireddit:$VERSION dokku/api:$VERSION && dokku tags:deploy api $VERSION"
