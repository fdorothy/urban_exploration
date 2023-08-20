#!/bin/bash

set -e

rm -rf dist
mkdir dist
cp index.html dist
cp index.js dist
mkdir dist/img
cp img/*.png dist/img/
mkdir dist/game-disks
cp game-disks/urban.js dist/game-disks/
mkdir dist/fonts
cp fonts/MomsTypewriter.ttf dist/fonts/
cp -r styles dist/styles
