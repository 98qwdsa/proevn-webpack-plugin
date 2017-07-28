var minimist = require('minimist');
var _ = require('lodash')
var path = require('path')
// 加载File System读写模块  
var fs = require('fs');  
// 加载编码转换模块  
var iconv = require('iconv-lite');
function proEvnPlugin(options) {
  var args = minimist(process.argv.slice(2));
  this.options = _.extend({
    EVN: 'pro',
    target: '',
  }, options, args);
}

proEvnPlugin.prototype.apply = function(compiler) {
    var opt = this.options
    var write = {};
    if (opt.target === '') {
        console.error('ERR: options need target params');
        return;
    }
    fs.exists(opt.target, function(exists) {
        var o = _.pick(opt, _.pull(_.keys(opt), '_', 'target'));
        if (exists) {
            fs.readFile(opt.target, function(err, data) {
                if (err) {
                  console.log("读取文件fail " + err);
                } else {
                    // 读取成功时  
                    // 输出字节数组
                    // utf-8  
                    var str = iconv.decode(data, 'utf-8');
                    _.forEach(o, function(v, k) {
                        var reg = new RegExp('(\\s{1}' + k + '\\s{1}=\\s+[\'|\"]+)(\\w+)([\'|\"]+;?)');
                         write[k] = _.trim(str.match(reg)[0].split('=')[1].replace(/(\w+)/,'$1'));
                        str = str.replace(reg, '$1'+v+'$3'); 
                    });

                    fs.writeFile(opt.target, str,function(err){
                        if(err) throw err;
                        next();
                    });
                }
            });
        } else {
            var str = '';
            _.forEach(o, function(v, k) {
                str += 'var ' + k + ' = \'' + v + '\';\n'
            })
            fs.writeFile(opt.target, str, function(err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    });
    function next(){  
        compiler.plugin('after-emit', function(compilation, callback) {
          // Create a header string for the generated file:
          fs.readFile(opt.target, function(err, data) {
                if (err) {
                  console.log("读取文件fail " + err);
                } else {
                    // 读取成功时  
                    // 输出字节数组
                    // utf-8  
                    var str = iconv.decode(data, 'utf-8');
                    _.forEach(write, function(v, k) {
                        var reg = new RegExp('(\\s{1}' + k + '\\s{1}=\\s+)[\'|\"]+(\\w+)[\'|\"]+(;?)');
                        str = str.replace(reg, '$1'+v+'$3'); 
                    });

                    console.log(str);

                    fs.writeFile(opt.target, str,function(err){
                        if(err) throw err;
                        callback();
                    });
                }
            });
        });
    }
};

module.exports = proEvnPlugin;