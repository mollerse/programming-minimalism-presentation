#!/usr/bin/env bash

build () {
  # First make sure we have a fresh build from js-sources
  npm run build

  # Set up some variables
  local DIR
  DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd -P)
  local TAG
  TAG=${1:-"test"}
  local PROJECT
  PROJECT="programming-minimalism-presentation"

  # Move build to approperiate location under /dist
  rsync -a $DIR/build/ $DIR/dist/$TAG

  # Replace asset urls with the correct one given the new location
  sed -i "s/\/assets/\/${PROJECT}\/dist\/${TAG}\/assets/g" $DIR/dist/$TAG/index.html

}
build "$1"
