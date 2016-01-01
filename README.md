## AngularJS + Bootstrap

### Development

Requirements:
* [Node](http://nodejs.org/)
* [NPM](http://npmjs.org/)

The project uses:
* [Gulp](http://gulpjs.com/)
* [Bower](http://bower.io/)
* [AngularJS](https://angularjs.org/)

#### Getting Started

Clone the repo, run `npm install` to install all dependencies.
After that you can either:
- Run `node_modules/.bin/gulp build` to build the project.
- Run `node_modules/.bin/gulp --env=prod` to start a local webserver with **AWESOME** automatic compilation and [Livereload](http://livereload.com/) (We use [gulp-connect](https://github.com/avevlad/gulp-connect)).

### Stylesheets

#### Theme

Responsive Dashboard uses [LESS](http://lesscss.org/) for styling so we take advantage of variables to theme the dashboard. Take a look at `src/less/dashboard/variables.less` and customize with your own colors.

#### Bootstrap + Font Awesome

The grid layout and components are powered by [Bootstrap](http://getbootstrap.com/), also Font Awesome icons are ready to use.
