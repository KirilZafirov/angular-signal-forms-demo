#!/bin/zsh
cd -- "${0:A:h}"
LOCAL_NODE="$PWD/../../work/tooling/node_modules/node/bin"
if [[ -x "$LOCAL_NODE/node" ]]; then export PATH="$LOCAL_NODE:$PATH"; fi
exec node node_modules/@angular/cli/bin/ng.js serve --host 127.0.0.1
