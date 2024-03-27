# ** Error Codes **

400 - DB error
401 - bad request
402 - bad db request
403 - bad db request


300 - success but row not found in DB
301 - Processed error  "expired"
302 - Processed Error
303 - Status check "completed"
304 - Processed Error


### 200 - Success

# To go production, check js/module/global.js, and set the url there toyour domain name url,
# change urls in backend app.js cors section to allow for your frontend to hit
# ensure backend_url and frontend_url in .env files are set up correctly
# ensure PGDB in backend database configuration is set to online postgress record.
# test the backend to see if it works, you hould get a message saying backend server is running successfully