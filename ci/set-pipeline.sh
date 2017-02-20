#!/bin/sh
echo y | fly -t home sp -p home-account -c pipeline.yml -l ../../credentials.yml
