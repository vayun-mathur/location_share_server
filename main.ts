var cnt = 0

Deno.serve((req: Request) => {
    cnt++
    return new Response(cnt + " visits")
});
