var fs = require('fs');
var path = require('path');
var bem = require('bem-xjst');

/**
 * Сборщик БЭМ-проекта.
 * Есть реализации следующих технологий блока:
 * - bemhtml
 * - css
 *
 * @constructor
 * @param {page} уровень переопределения
 */
var Assembler = function(page, baseFolder) {
    this._baseFolder = baseFolder || __dirname;
    this._page = page;
    this._blocksFolders = [
        // общие блоки
        path.join(baseFolder, 'blocks'),
        // уровень переопределения страницы
        path.join(baseFolder, page + '.blocks')
    ];
};
module.exports = Assembler;

/**
 * Запускает сборку
 */
Assembler.prototype.run = function() {
    var html = this._compileTemplates();
    var css = this._compileCSS();

    fs.writeFileSync(this._getPathFile('html'), html);
    fs.writeFileSync(this._getPathFile('css'), css);
};

/**
 * Возвращает скомпилированный html
 * @return {String} html
 */
Assembler.prototype._compileTemplates = function() {
    var template = bem.compile(this._getContent('bemhtml'));
    var bemjson = require(this._getPathFile('bemjson.js'));

    return template.apply(bemjson);
};

/**
 * Возвращает скомпилированный CSS:
 * пока нет препроцессора — это просто цсс всех файликов, собранный в один
 * @return {String} css
 */
Assembler.prototype._compileCSS = function() {
    return this._getContent('css');
};

/**
 * Возвращает путь к файлу страницы определенного расширения
 * @param  {String} ext
 * @return {String}
 */
Assembler.prototype._getPathFile = function(ext) {
    return path.join(this._baseFolder, '/pages/', this._page, this._page + '.' + ext);
};

/**
 * Возвращает контент файлов указанной технологии блоков
 * @param  {String} tech {css|bemhtml}
 * @return {String}
 */
Assembler.prototype._getContent = function(tech) {
    return (this._getFiles(tech)
        .map(function(file) {
            return fs.readFileSync(file, 'UTF-8');
        })
        .reduce(function(a, b) {
            return a + b;
        })
    );
};

/**
 * Возвращает пути файлов указанной технологии блоков
 * @param  {String} tech {css|bemhtml}
 * @return {String}
 */
Assembler.prototype._getFiles = function(tech) {
    return this._blocksFolders.map(function(folder) {
        var files = [];

        try {
            files = (fs.readdirSync(folder)
                .map(function(name) {
                    var blockFolder = path.join(folder, name);

                    return (fs.readdirSync(blockFolder)
                        .filter(function(file) {
                            return file.indexOf(tech) > -1;
                        })
                        .map(function(file) {
                            return path.join(blockFolder, file);
                        })
                    );
                })
                .reduce(function(a, b) {
                    return a.concat(b);
                })
            );
        } catch (e) {};

        return files;
    }).reduce(function(a, b) {
        return a.concat(b);
    });
};
