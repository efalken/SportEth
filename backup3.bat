robocopy python ..\avaxsportsbook\python /E
robocopy docs ..\avaxsportsbook\docs /E 
robocopy private ..\avaxsportsbook\private /E 
robocopy dapp ..\avaxsportsbook\dapp /E /XD node_modules
robocopy smart ..\avaxsportsbook\smart /E /XD node_modules
robocopy backend ..\avaxsportsbook\backend /E /XD node_modules