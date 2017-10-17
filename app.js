var marked = require('marked');
var fs = require('fs');
var handlebars = require('handlebars');
var chalk = require('chalk');

fs.readFile('./template.hbs', 'utf8', function(err, template){
    if (err) throw err;
    var compile = handlebars.compile(template);
    fs.readdir('./src', function(err, files) {
        if (err) throw err;
        var fileExtension = '';
        var fileName = '';
        console.log('\n ' + chalk.yellow(files.length) + ' files found.');
        console.log('-----------------------------');
        for (var i=0; i<files.length; i++) {
            fileName = files[i].substr(0, files[i].lastIndexOf('.'));
            fileExtension = files[i].substr(files[i].lastIndexOf('.')+1);
            console.log(' ' + chalk.blue(i) + ': ' + files[i]);
            fs.readFile('./src/' + files[i], 'utf8', function(err, md){
                if (err) throw err;
                var data = {
                    title: 'Scope',
                    md: marked(md)
                }
                var html = compile(data);
                fs.writeFile('./dist/' + fileName + '.html', html, 'utf8', function(err) {
                    if (err) throw err;
                    if (i === files.length) console.log(chalk.green('\n complete!'));
                })
            })


        }
    })

});
