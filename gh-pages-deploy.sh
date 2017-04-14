#!/usr/bin/env bash

gulp build

git branch -D gh-pages
git add -f dist/** && \
 git commit -m "chore(release): gh-pages release" && \
 git subtree split --prefix dist -b gh-pages && \
 git push origin gh-pages:gh-pages --force-with-lease && \
 git branch -D gh-pages && \
 git reset --hard HEAD~1
