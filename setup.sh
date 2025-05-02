cd DB/export
docker build -f DockerFile -t cookie_export
cd ..
docker-compose up -d
cd ../crawler
npm i
