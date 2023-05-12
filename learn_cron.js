const cron = require("node-cron");
const moment = require("moment")
/*
  Cron schedule Expression method for timing :
  (second(optional 0-59), minute(0-59), hour(0-23), day of month(1-31), month(1-12/name of month), day of week(0-7/name of day))

  You can play with the time setting in different manner like...
  Using ranges : 1-5 * * * * => running every minute to 1 from 5 (at 1, 2, 3, 4, 5)
  Using step value's : step/time * * * * * => running every second interval you define in second variable (Ex.: 1-10/2, * /10)
  Using multiples value's : 1,2,4,5 * * * * => running every minute 1, 2, 4 and 5
  Using names : * * * January,September Sunday => running every Sunday's of January and September'
  Using short-names : * * * Jan,Sep Sun => running every Sunday's of January and September
*/

/*
    Syntax of schedule => cron.schedule(expression, function, options)

    expression string: Cron expression
    function Function: Task to be executed
    options Object: Optional configuration for job scheduling.

*/

cron.schedule("30 * * * * *", () => {
  // console.log(`Cron run at ${new Date().toLocaleString()}`)
  console.log(`Cron run at ${moment().format('DD-MM-YYYY hh:mm:ss A')}`)
})