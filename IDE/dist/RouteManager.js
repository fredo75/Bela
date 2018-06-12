"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra-promise");
var paths = require("./paths");
var socket_manager = require("./SocketManager");
var archiver = require("archiver");
var mime = require("mime");
function download(req, res) {
    if (req.query.all) {
        download_all(res);
    }
    else if (req.query.project && req.query.file) {
        download_file(req, res);
    }
    else if (req.query.project) {
        download_project(req, res);
    }
}
exports.download = download;
// zip the entire projects directory and send back
function download_all(res) {
    send_zip(paths.projects, 'projects', res);
}
// zip a single project directory and send back
function download_project(req, res) {
    send_zip(paths.projects + req.query.project, req.query.project, res);
}
function send_zip(path, name, res) {
    res.setHeader('Content-disposition', 'attachment; filename=' + name + '.zip');
    res.setHeader('Content-type', 'application/zip');
    var archive = archiver('zip');
    archive.on('error', function (e) {
        socket_manager.broadcast('report-error', e);
        res.end();
    });
    archive.pipe(res);
    archive.directory(path, name, { name: name + '.zip' });
    archive.finalize();
}
function download_file(req, res) {
    var file = paths.projects + req.query.project + '/' + req.query.file;
    res.setHeader('Content-disposition', 'attachment; filename=' + req.query.file);
    res.setHeader('Content-type', mime.getType(file));
    // this should really go through the file_manager lock - TODO
    fs.createReadStream(file).pipe(res);
}
function doxygen(req, res) {
    res.set('Content-Type', 'text/xml');
    // this should really go through the file_manager lock - TODO
    fs.readFileAsync(paths.Bela + 'Documentation/xml/' + req.query.file + '.xml', 'utf-8')
        .then(function (xml) { return res.send(xml); })
        .catch(function () { return res.status(500).send('file ' + req.query.file + '.xml not found'); });
}
exports.doxygen = doxygen;
function rebuild_project(req, res) {
    console.log('request received, project ', req.query.project);
    socket_manager.broadcast('rebuild-project', req.query.project);
    res.status(200).send();
}
exports.rebuild_project = rebuild_project;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QkFBb0IsR0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO1NBQzlFLElBQUksQ0FBRSxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQWIsQ0FBYSxDQUFFO1NBQzVCLEtBQUssQ0FBRSxjQUFNLE9BQUEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFDLGdCQUFnQixDQUFDLEVBQTdELENBQTZELENBQUUsQ0FBQztBQUNoRixDQUFDO0FBTkQsMEJBTUM7QUFFRCx5QkFBZ0MsR0FBb0IsRUFBRSxHQUFxQjtJQUMxRSxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0QsY0FBYyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9ELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDeEIsQ0FBQztBQUpELDBDQUlDIiwiZmlsZSI6IlJvdXRlTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYS1wcm9taXNlJztcbmltcG9ydCAqIGFzIHBhdGhzIGZyb20gJy4vcGF0aHMnO1xuaW1wb3J0ICogYXMgc29ja2V0X21hbmFnZXIgZnJvbSAnLi9Tb2NrZXRNYW5hZ2VyJztcbmltcG9ydCAqIGFzIGFyY2hpdmVyIGZyb20gJ2FyY2hpdmVyJztcbmltcG9ydCAqIGFzIG1pbWUgZnJvbSAnbWltZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkb3dubG9hZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKXtcblx0aWYocmVxLnF1ZXJ5LmFsbCl7XG5cdFx0ZG93bmxvYWRfYWxsKHJlcyk7XG5cdH0gZWxzZSBpZiAocmVxLnF1ZXJ5LnByb2plY3QgJiYgcmVxLnF1ZXJ5LmZpbGUpe1xuXHRcdGRvd25sb2FkX2ZpbGUocmVxLCByZXMpO1xuXHR9IGVsc2UgaWYgKHJlcS5xdWVyeS5wcm9qZWN0KXtcblx0XHRkb3dubG9hZF9wcm9qZWN0KHJlcSwgcmVzKTtcblx0fVxufVxuXG4vLyB6aXAgdGhlIGVudGlyZSBwcm9qZWN0cyBkaXJlY3RvcnkgYW5kIHNlbmQgYmFja1xuZnVuY3Rpb24gZG93bmxvYWRfYWxsKHJlczogZXhwcmVzcy5SZXNwb25zZSl7XG5cdHNlbmRfemlwKHBhdGhzLnByb2plY3RzLCAncHJvamVjdHMnLCByZXMpO1xufVxuLy8gemlwIGEgc2luZ2xlIHByb2plY3QgZGlyZWN0b3J5IGFuZCBzZW5kIGJhY2tcbmZ1bmN0aW9uIGRvd25sb2FkX3Byb2plY3QocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSl7XG5cdHNlbmRfemlwKHBhdGhzLnByb2plY3RzK3JlcS5xdWVyeS5wcm9qZWN0LCByZXEucXVlcnkucHJvamVjdCwgcmVzKTtcbn1cblxuZnVuY3Rpb24gc2VuZF96aXAocGF0aDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIHJlczogZXhwcmVzcy5SZXNwb25zZSl7XG5cdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtZGlzcG9zaXRpb24nLCAnYXR0YWNobWVudDsgZmlsZW5hbWU9JytuYW1lKycuemlwJyk7XG5cdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi96aXAnKTtcblx0bGV0IGFyY2hpdmUgPSBhcmNoaXZlcignemlwJyk7XG5cdGFyY2hpdmUub24oJ2Vycm9yJywgKGU6IEVycm9yKSA9PiB7XG5cdFx0c29ja2V0X21hbmFnZXIuYnJvYWRjYXN0KCdyZXBvcnQtZXJyb3InLCBlKTtcblx0XHRyZXMuZW5kKCk7XG5cdH0pO1xuXHRhcmNoaXZlLnBpcGUocmVzKTtcblx0YXJjaGl2ZS5kaXJlY3RvcnkocGF0aCwgbmFtZSwge25hbWU6IG5hbWUrJy56aXAnfSk7XG5cdGFyY2hpdmUuZmluYWxpemUoKTtcbn1cblxuZnVuY3Rpb24gZG93bmxvYWRfZmlsZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKXtcblx0bGV0IGZpbGUgPSBwYXRocy5wcm9qZWN0cytyZXEucXVlcnkucHJvamVjdCsnLycrcmVxLnF1ZXJ5LmZpbGU7XG5cdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtZGlzcG9zaXRpb24nLCAnYXR0YWNobWVudDsgZmlsZW5hbWU9JytyZXEucXVlcnkuZmlsZSk7XG5cdHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtdHlwZScsIG1pbWUuZ2V0VHlwZShmaWxlKSk7XG5cdC8vIHRoaXMgc2hvdWxkIHJlYWxseSBnbyB0aHJvdWdoIHRoZSBmaWxlX21hbmFnZXIgbG9jayAtIFRPRE9cblx0ZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlKS5waXBlKHJlcyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb3h5Z2VuKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2Upe1xuXHRyZXMuc2V0KCdDb250ZW50LVR5cGUnLCAndGV4dC94bWwnKTtcblx0Ly8gdGhpcyBzaG91bGQgcmVhbGx5IGdvIHRocm91Z2ggdGhlIGZpbGVfbWFuYWdlciBsb2NrIC0gVE9ET1xuXHRmcy5yZWFkRmlsZUFzeW5jKHBhdGhzLkJlbGErJ0RvY3VtZW50YXRpb24veG1sLycrcmVxLnF1ZXJ5LmZpbGUrJy54bWwnLCAndXRmLTgnKVxuXHRcdC50aGVuKCB4bWwgPT4gcmVzLnNlbmQoeG1sKSApXG5cdFx0LmNhdGNoKCAoKSA9PiByZXMuc3RhdHVzKDUwMCkuc2VuZCgnZmlsZSAnK3JlcS5xdWVyeS5maWxlKycueG1sIG5vdCBmb3VuZCcpICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWJ1aWxkX3Byb2plY3QocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSl7XG5cdGNvbnNvbGUubG9nKCdyZXF1ZXN0IHJlY2VpdmVkLCBwcm9qZWN0ICcsIHJlcS5xdWVyeS5wcm9qZWN0KTtcblx0c29ja2V0X21hbmFnZXIuYnJvYWRjYXN0KCdyZWJ1aWxkLXByb2plY3QnLCByZXEucXVlcnkucHJvamVjdCk7XG5cdHJlcy5zdGF0dXMoMjAwKS5zZW5kKCk7XG59XG4iXX0=