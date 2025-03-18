chmod 777 -R www
rm -r www/browser
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --force
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build 
exit 0