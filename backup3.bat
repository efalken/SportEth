robocopy python ..\asbFuji\python /E
robocopy docs ..\asbFuji\docs /E 
robocopy private ..\asbFuji\private /E 
robocopy dapp ..\asbFuji\dapp /E /XD node_modules
robocopy smart ..\asbFuji\smart /E /XD node_modules
robocopy backend ..\asbFuji\backend /E /XD node_modules