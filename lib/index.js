var fs = require('fs');
var path = require('path');
var bem = require('bem-xjst');

/**
 * Сборщик БЭМ-проекта.
 * Есть реализации следующих технологий блока:
 * - bemhtml
 * - css
 * - картинки
 *
 * @constructor
 * @param {page} уровень переопределения
 */
var Assembler = function(page, baseFolder) {
    this._baseFolder = baseFolder || __dirname;
    this._page = page;
    this._blocksFolders = [
        // общие блоки
        path.join(baseFolder, 'common.blocks'),
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

    fs.writeFileSync(path.join(this._getFolderPage(), this._page + '.html'), html);
    fs.writeFileSync(path.join(this._getFolderPage(), this._page + '.css'), css);

    this._copyImages();
};

/**
 * Копирует картинки в итоговую папку со стилями
 */
Assembler.prototype._copyImages = function() {
    var asm = this;
    var images = this._getFilesByExt('jpg');

    images.forEach(function(img) {
        var dstPath = path.join(asm._getFolderPage(), path.basename(img));
        var src = fs.createReadStream(img);
        var dst = fs.createWriteStream(dstPath);

        src.pipe(dst);
    });
};

/**
 * Возвращает путь к папке с текущей страницей
 * @return {String}
 */
Assembler.prototype._getFolderPage = function() {
    return path.join(this._baseFolder, 'pages', this._page);
}

/**
 * Возвращает скомпилированный html
 * @return {String} html
 */
Assembler.prototype._compileTemplates = function() {
    var template = bem.compile(this._getContent('bemhtml'));
    var bemjson = require(path.join(this._getFolderPage(), this._page + '.bemjson.js'));

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
 * Возвращает контент файлов указанной технологии блоков
 * @param  {String} tech {css|bemhtml}
 * @return {String}
 */
Assembler.prototype._getContent = function(tech) {
    return (this._getFilesByExt(tech)
        .map(function(file) {
            return fs.readFileSync(file, 'UTF-8');
        })
        .reduce(function(a, b) {
            return a + b;
        })
    );
};

/**
 * Возвращает пути файлов по расширению.
 * @param  {String} ext
 * @return {String}
 */
Assembler.prototype._getFilesByExt = function(ext) {
    return this._blocksFolders.map(function(folder) {
        try {
            return (fs.readdirSync(folder)
                .map(function(name) {
                    var blockFolder = path.join(folder, name);

                    return (fs.readdirSync(blockFolder)
                        .filter(function(file) {
                            return file.indexOf(ext) > -1;
                        })
                        .map(function(file) {
                            return path.join(blockFolder, file);
                        })
                    );
                })
                .reduce(function(a, b) {
                    return a.concat(b);
                }, [])
            );
        } catch (e) {
            return [];
        };
    }).reduce(function(a, b) {
        return a.concat(b);
    });
};
