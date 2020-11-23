# DEPLOYMENT PROCESS FOR api PROJECT
**EXECUTED ON UBUNTU 16.04**

## Requirements

### Getting NodeJS (8.11.3) and NPM (5.6.0)

```
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ sudo npm install npm --global
```

### Getting pm2

```
$ npm install pm2@latest -g
```

### Getting Apache2

```
$ sudo apt-get update
$ sudo apt-get install apache2
```

Configure apache2 by modify the `/etc/apache2/apache2.conf` file:

```
$ sudo nano /etc/apache2/apache2.conf
```

Add this line at the bottom of the file (by remplacing server_domain_or_ip by your domain (api.klaud9.com):

```
ServerName server_public_IP
```

Verify the syntax:

```
$ sudo apache2ctl configtest
```

It should show:

```
Output
Syntax OK
```

Then restart Apache2

```
$ sudo systemctl restart apache2
```

For further help: `https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu-16-04#how-to-find-your-server-39-s-public-ip-address`

### Getting Certbot

```
$ sudo apt-get update
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get update
$ sudo apt-get install python-certbot-apache 
```

## Importing the project

Clone the repository into the server

```
$ git clone git@bitbucket.org:klaud9/api.git
```

## Building and running the project

Get into the folder

```
$ cd api
```

Get the node dependencies for the project

```
$ npm install
```

Create the configuration file `config/config.js` from `config/config.dist.js`:

```
$ cp config/config.dist.js config/config.js
```

And fill it with your configurations.
Then you can run the project

```
$ npm start
```

The pm2 status interface should be showed.
Make sure the site is online by checking the status doing:

```
$ pm2 status
```

## Creating the virtual host

Enable the Proxy option in apache:

```
$ a2enmod proxy
$ a2enmod proxy_http
```

Create the file `api.conf` in the `/etc/apache2/sites-available/` directory with this content:

```
<VirtualHost *:80>
        ServerName api.klaud9.com
        ProxyPreserveHost On
        ProxyPass / http://localhost:PORT/
        ProxyPassReverse / http://localhost:PORT/
</VirtualHost>

```
Replace the `PORT` value with the port when your app is running.

Register the host with:

```
$ sudo a2ensite api.conf
```

Restart your Apache2 service:

```
$ sudo service apache2 restart
```

Test `http://api.klaud9.com` on your browser, the API mainpage should happen.

## Certificating the website

Run Certbot

```
$ sudo certbot --apache
```

And follow the instructions. It will certify the applications you like automatically. Enable automatic redirection when it will be asked.

Then, you can run this command to renew automatically your certify.

```
$ sudo certbot renew --dry-run
```

Test `http://api.klaud9.com` or `https://api.klaud9.com` on your browser, the API mainpage should happen with the secured `https` protocol.

## Probable errors

**Uncompiling JS**
Check the version of your NodeJS and NPM
Node should be 8.11.3 and NPM should be 5.6.0

**503 Service Unavailable Error**
This error can happend when the Javascript app run with errors. Check if your application is running without JS errors thanks to:

```
$ pm2 status
```