# # Image source
# FROM node:18-alpine3.16

# # Docker working directory
# WORKDIR /app

# # Copying file into APP directory of docker
# COPY ./package.json ./package-lock.json /app/

# # Then install the NPM module
# RUN npm install

# # Copy current directory to APP folder
# COPY . /app/

# EXPOSE 3000
# CMD ["npm", "run", "start:dev"]





###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .
# RUN npm run build

USER node


###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "npm", "run", "start:prod" ]
