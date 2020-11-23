# INSTALLATION PROCESS FOR api PROJECT
**EXECUTED ON UBUNTU 16.04**

## Importing the project

Clone the repository into /var/www

```
$ git clone
```

Get into the folder

```
$ cd api
```

## Building the project

### Get NVM (if not done before)

Get NPM version manager 

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

Restart your CLI and try

```
$ command -v nvm
```

If it shows "nvm" then the installation is OK.


### Get Node and NPM (if not done before)


Get Node (version 8.11.3)

```
$ nvm install 8.11.3
$ sudo chown -R $USER:$(id -gn $USER) /home/<YOUR>/.config
```

### Set up the project

Get webpack 3.10.0 by running :

```
npm install --save-dev webpack@3.10.0
```

Get node dependencies by running :

```
$ npm install
```

If permissions access issues, try doing it in sudo

```
$ sudo npm install
```

If `Not recognized command 'npm'` error append, then turn into sudo mode :

```
$ sudo -s
$ npm install
```

If the `gyp WARN EACCES user "root" does not have permission to access the dev dir` info is shown all along a long install, try:

```
$ npm install --unsafe-perm
```

### Configure the project

The project can be configured thanks to the `/config/config.js` file.

**Database**

You need to configure a database to makes the API work.
For example with a local database:

```
// Local database
config.mysql = {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'contribute_rprod',
};
```

**JWT**

You need to configure the JWT secret to make the `/login` route works:

```
// JWT HMAC SHA256
config.jwtSecret = 'secret'; // Any value can work
```

## Running the project

Run

```
$ node klaud9
```

to run the project

It would be enable on [127.0.0.1:8080](127.0.0.1:8080)