#!/usr/bin/env bash

git checkout master
npm run release && npm run gh-deploy && git push --follow-tags --force-with-lease
