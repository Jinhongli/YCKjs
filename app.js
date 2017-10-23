var marked = require('marked');
var fs = require('fs');
var handlebars = require('handlebars');
var chalk = require('chalk');

fs.mkdir('./dist/', function(){
    fs.readFile('./template.hbs', 'utf8', function(err, template){
        if (err) throw err;
        var compile = handlebars.compile(template);
        fs.readdir('./src', function(err, files) {
            if (err) throw err;
            console.log('\n ' + chalk.yellow(files.length) + ' files found.');
            console.log('-----------------------------');
            for (var i=0; i<files.length; i++) {
                (function IIFE(i){
                    // fileName = files[i].substr(0, files[i].lastIndexOf('.'));
                    // fileExtension = files[i].substr(files[i].lastIndexOf('.')+1);
                    console.log(' ' + chalk.blue(i) + ': ' + files[i]);
                    fs.readFile('./src/' + files[i], 'utf8', function(err, md){
                        if (err) throw err;
                        var data = {
                            title: 'Scope',
                            md: marked(md)
                        }
                        var html = compile(data);
                        fs.writeFile('./dist/' + files[i].substr(0, files[i].lastIndexOf('.')) + '.html', html, 'utf8', function(err) {
                            console.log(i)
                            if (err) {
                                throw err;
                            }
                        });
                    });
                })(i);
            }
        });
    });
})
