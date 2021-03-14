#!/usr/bin/env node
import repl from 'repl';

const node = process.argv[2];
const shortcuts = process.argv[3];
const keySpace = process.argv[4];
const successors = process.argv[5];

const local = repl.start('node::local> ');
//Adding "mood" and "bonus" to the local REPL's context.
local.context.node = node;
local.context.shortcuts = shortcuts;
local.context.keySpace = keySpace;
local.context.successors = successors;
