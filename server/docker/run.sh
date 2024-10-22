cd /wave-pulse
git pull origin main
cd server
rm -r build
npm install
npm run build
npm run start
