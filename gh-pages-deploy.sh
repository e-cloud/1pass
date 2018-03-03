#!/usr/bin/env bash

npm run build

currentBranch=`git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'`

git checkout gh-pages
  mv dist/** ./ && \
  git add -A && \
  git commit -m "chore(release): gh-pages release" && \
  git push origin gh-pages:gh-pages && \
  git checkout $currentBranch
