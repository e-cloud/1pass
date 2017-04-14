#!/usr/bin/env bash

gulp build

git add -f dist/** && \
 git commit -m "chore(release): gh-pages release" && \
 git subtree split --prefix dist -b gh-pages && \
 git push origin gh-pages:gh-pages --force-with-lease && \
 git reset --hard HEAD~1
