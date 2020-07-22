#!/bin/bash

git diff -- "." ":(exclude)package-lock.json"
