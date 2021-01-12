#!/usr/bin/env bash
set -e

[ -z $DEPLOY_TARGET ] && echo "Deploy target: " && read DEPLOY_TARGET

echo 'Deploy Metano to '$DEPLOY_TARGET
rsync -avz ./dist/artifact.tar $DEPLOY_TARGET:/root/metano-release.tar

echo 'Reload Metano server'
ssh -t $DEPLOY_TARGET 'cd /root && mkdir -p metano && tar -xvf metano-release.tar -C /root/metano && cd metano && npm install'
