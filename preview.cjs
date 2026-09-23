const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'dist');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.mp3':'audio/mpeg'};
http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end()}
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
 fs.stat(file,(err,stat)=>{
  if(err||!stat.isFile()){res.writeHead(404);return res.end('Not found')}
  const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
  let start=0,end=stat.size-1,status=200;
  if(req.headers.range){const m=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);if(!m){res.writeHead(416,{'Content-Range':'bytes */'+stat.size});return res.end()}
   start=Number(m[1]);end=m[2]?Math.min(Number(m[2]),end):end;if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':'bytes */'+stat.size});return res.end()}
   status=206;headers['Content-Range']='bytes '+start+'-'+end+'/'+stat.size;
  }
  headers['Content-Length']=end-start+1;res.writeHead(status,headers);if(req.method==='HEAD')return res.end();fs.createReadStream(file,{start,end}).pipe(res);
 });
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
