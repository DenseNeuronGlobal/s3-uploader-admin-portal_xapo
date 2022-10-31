FROM node:15.4 as build

WORKDIR /denseneuron-react-aws

COPY package*.json .

RUN yarn install

COPY . .

RUN yarn run build

FROM nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /denseneuron-react-aws/build /usr/share/nginx/html