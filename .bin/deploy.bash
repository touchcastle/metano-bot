export $(cat .env | grep -v ^# | xargs)
echo 'Deploy Metano to '$DEPLOY_TARGET
rsync -avz ./dist/artifact.tar $DEPLOY_TARGET:/root/metano-release.tar
ssh -t $DEPLOY_TARGET 'cd /root && mkdir -p metano && tar -xvf metano-release.tar -C /root/metano && cd metano && npm install'
