## Built With

* [Angular version 11.2.9.](https://angular.io/)

## Getting Started

These are instructions on how to set up the P-LPL editor front-end locally.

1. Download and install NodeJS from the official webside `https://nodejs.org/en/download/`

2. Make sure NodeJS was successfully installed (by opening a terminal and type `node -v`)

3. Make sure npm packet manager was successfully installed (by opening a terminal and type `npm -v`)

4. Install Angular CLI `npm install -g @angular/cli`

5. run `npm install` to install all needed dependencies

6. Edit the variable `herokuApiUrl` in file `src\app\service\export.service` to point to the IP-address of the back-end if running on a different machine.

7. run `ng serve` to run the editor locally. 

8. Navigate to `http://localhost:4200/` to open the editor in your browser.
The app will reload automatically if you make changes in the source files.