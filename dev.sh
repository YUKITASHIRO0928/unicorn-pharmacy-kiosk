#!/bin/bash
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
cd /Users/uriur/Projects/uketuke
exec node node_modules/.bin/next dev --webpack --port 3000
