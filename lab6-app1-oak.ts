import { Application, Context } from 'https://deno.land/x/oak/mod.ts';

const app = new Application();

app.use(async (ctx: Context) => {
  let name = '';

  if (ctx.request.method === 'GET') {
    const queryParams = ctx.request.url.searchParams;
    name = queryParams.get('name') || '';
  } else {
    const requestBody = await ctx.request.body().value;
    name = requestBody ? requestBody.name : '';
  }

  console.log('---------------------------');
  console.log('\x1B[35mctx.request.url\x1B[0m =', ctx.request.url);
  console.log('\x1B[35mctx.request.body\x1B[0m  =', name);

  const accepts = ctx.request.accepts(['html', 'text', 'json', 'xml']);
  switch (accepts) {
    case 'json':
      ctx.response.headers.set('Content-Type', 'application/json');
      ctx.response.body = JSON.stringify({ welcome: `Hello '${name}'` });
      console.log(`The server sent a \x1B[31mJSON\x1B[0m document to the browser`);
      break;
    case 'xml':
      ctx.response.headers.set('Content-Type', 'application/xml');
      ctx.response.body = `<welcome>Hello '${name}'</welcome>`;
      console.log(`The server sent an \x1B[31mXML\x1B[0m document to the browser`);
      break;
    default:
      ctx.response.headers.set('Content-Type', 'text/plain');
      ctx.response.body = `Hello '${name}'`;
      console.log(`The server sent a \x1B[31mplain text\x1B[0m document to the browser`);
  }
});

console.log('The server was started on port 8000');
console.log('To stop the server, press "CTRL + C"');

await app.listen({ port: 8000 });