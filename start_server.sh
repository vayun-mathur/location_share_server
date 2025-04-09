#!/bin/bash
rm my-website.sock
/root/.deno/bin/deno run -A --unstable-cron main.ts
