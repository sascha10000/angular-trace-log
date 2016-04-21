# angular-trace-log
You will get a log message each time a controller, service, factory or directive will be registered or called. You only need to include the script and it will be invoked automatically.

You may use this for learning or logging purposes. The only thing todo is adding

    <script src="angular-trace-log.js"></script>

below the angularjs include but above your own Javascript files.
By dropping the line everything will work as before again.

By now it's only tested with controllers, directives and factories. Usage on own risk.

Further explanations: 
Basically some angular functions will be overriden at runtime. Therefore if unexpected errors occur, drop the include.
