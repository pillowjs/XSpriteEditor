install:
	@npm install
server: install
	@`npm bin`/startserver
