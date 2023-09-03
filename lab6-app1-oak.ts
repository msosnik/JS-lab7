import { Application, Context, Router } from 'https://deno.land/x/oak/mod.ts';
import { dejsEngine, oakAdapter, viewEngine } from "https://deno.land/x/view_engine@v10.6.0/mod.ts";

function encodeXML(text: string): string {
return text.replace(/[<>&'"]/g, function (char) {
    switch (char) {
    case '<': return '&lt;';
    case '>': return '&gt;';
    case '&': return '&amp;';
    case "'": return '&apos;';
    case '"': return '&quot;';
    default: return char;
    }
  });
}

const app = new Application();
const router = new Router();

// Initialize Oak View Engine
app.use(
    viewEngine(oakAdapter, dejsEngine, {
      viewRoot: "./views-lab6-ejs",
    })
  );

// Route for the homepage
router.get('/', async (ctx: Context) => {
    // Handle GET request for the homepage
    await ctx.render('index'); 
  });

router.all('/submit', async (ctx: Context) => {
  let name = '';

  if (ctx.request.method === 'GET') {
    const queryParams = ctx.request.url.searchParams;
    name = queryParams.get('name') || '';
  } else {
    const requestBody = await ctx.request.body().value;
    if (requestBody instanceof URLSearchParams) {
        name = requestBody.get('name') || '';
    }
  }

  console.log('---------------------------');
  console.log('\x1B[35mctx.request.url\x1B[0m =', ctx.request.url);
  console.log('\x1B[35mctx.request.body\x1B[0m  =', name);

  const acceptHeader = ctx.request.headers.get('Accept');
  
  if (acceptHeader) {
    if (acceptHeader.includes('application/json')) {
      ctx.response.headers.set('Content-Type', 'application/json');
      ctx.response.body = JSON.stringify({ welcome: `Hello '${name}'` });
      console.log(`The server sent a \x1B[31mJSON\x1B[0m document to the browser`);
    } else if (acceptHeader.includes('application/xml')) {
      name = name !== undefined ? encodeXML(name) : '';
      ctx.response.headers.set('Content-Type', 'application/xml');
      ctx.response.body = `<welcome>Hello '${name}'</welcome>`;
      console.log(`The server sent an \x1B[31mXML\x1B[0m document to the browser`);
    } else {
      ctx.response.headers.set('Content-Type', 'text/plain');
      ctx.response.body = `Hello '${name}'`;
      console.log(`The server sent a \x1B[31mplain text\x1B[0m document to the browser`);
    }
  }
});

app.use(router.routes());

console.log('The server was started on port 8000');
console.log('To stop the server, press "CTRL + C"');

await app.listen({ port: 8000 });