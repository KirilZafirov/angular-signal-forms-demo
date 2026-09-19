import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=fileURLToPath(new URL('../dist/signal-forms-demo/browser/',import.meta.url));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.ico':'image/x-icon'};
http.createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(base,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(base)){res.writeHead(403);res.end();return;}
  let data; let extension=path.extname(file);
  try {data=await fs.readFile(file);} catch(error) {
   if (error.code!=='ENOENT' || extension) throw error;
   data=await fs.readFile(path.join(base,'index.html'));extension='.html';
  }
  res.setHeader('Content-Type',types[extension]||'application/octet-stream');res.end(data);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(4201,'127.0.0.1',()=>console.log('Built demo: http://127.0.0.1:4201 — Ctrl+C to stop'));
