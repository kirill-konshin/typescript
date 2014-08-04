.PHONY: tsc
tsc:
	tsc --module 'commonjs' --outDir ./build/tsc --sourcemap ./lib/node.ts
