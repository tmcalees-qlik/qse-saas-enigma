# Read Me

## Purpose
This is a very simple web page that connects to a Qlik Sense Enterprise SaaS (QSE SaaS) tenant and displays information about applications.  It is NOT intended to be a comprehensive example of using APIs with QSE SaaS.  It is meant to provide a very simple example of logging in and querying some information.

## Prerequisites for the QSE SaaS Enigma example:
- A web server of your choice that supports SSL
- I used the following:
    - Node.js
    - OpenSSL

## Setup Instructions:
These instructions are based on my use of Node.js and OpenSSL.  I have not provided information on installing and configuring these tools up in your environment.  Please follow the installation guidelines that come with these tools.

- Unzip this project into a directory
- Create a certificate for the HTTPS server using OpenSSL, note that this command may prompt you for additional information, enter the information needed and continue:
    - openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
    - Make sure the certificates generated by openssl are located in the root folder of your project directory.
- Start the Node.js HTTPS server using the certificates generated in the previous step:
    - npx http-server -S -c -l