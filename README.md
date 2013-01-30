bodymediajs
===========

Javascript code to interact with the Bodymedia API in node.js

Usage:
======

    $ npm install bodymedia
    $ export BODYMEDIA_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    $ export BODYMEDIA_SHARED_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    $ node node_modules/bodymedia/call_bodymedia_url.js --url 'http://api.bodymedia.com/v1.0/json/goal/DAILY_CAL_BURN'
    calling url: https://api.bodymedia.com/oauth/request_token
    delay: 1
    setting up localhost callback listener
    trying port 8080
    listening...
    attempting to open a browser to visit this url: https://api.bodymedia.com/oauth/authorize?oauth_token=54e5d221-05f4-48c5-956d-5208396f89fb&api_key=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&oauth_callback=http://localhost:8080/
    received localhost callback request
    calling url: https://api.bodymedia.com/oauth/access_token
    delay: 1
    delay: 500
    1359582496615: calling request.get
    {
      "type": "DAILY_CAL_BURN",
      "values": [
        {
          "value": "3050",
          "startDate": "2010-10-20T12:42:03.833-04:00",
          "endDate": "2011-01-07T08:08:03.564-05:00",
          "measure": "CALORIE"
        },
        {
          "value": "2843",
          "startDate": "2011-01-07T08:08:03.564-05:00",
          "endDate": "2011-06-09T14:18:37.262-04:00",
          "measure": "CALORIE"
        },
        {
          "value": "2850",
          "startDate": "2011-06-09T14:18:37.262-04:00",
          "endDate": "2012-03-22T15:45:48.672-04:00",
          "measure": "CALORIE"
        },
        {
          "value": "3000",
          "startDate": "2012-03-22T15:45:48.672-04:00",
          "endDate": "2012-03-22T15:47:39.187-04:00",
          "measure": "CALORIE"
        },
        {
          "value": "3000",
          "startDate": "2012-03-22T15:47:39.187-04:00",
          "endDate": "2012-05-29T17:54:43.371-04:00",
          "measure": "CALORIE"
        },
        {
          "value": "3000",
          "startDate": "2012-05-29T17:54:43.371-04:00",
          "endDate": "2012-05-29T17:55:09.822-04:00",
          "measure": "CALORIE"
        },
        {
          "value": "3000",
          "startDate": "2012-05-29T17:55:09.822-04:00",
          "endDate": "2012-07-13T11:17:08.005-04:00",
          "measure": "CALORIE"
        },
        {
          "value": "3200",
          "startDate": "2012-07-13T11:17:08.005-04:00",
          "endDate": "2012-07-13T14:00:25.396-04:00",
          "measure": "CALORIE"
        },
        {
          "value": "2950",
          "startDate": "2012-07-13T14:00:25.396-04:00",
          "measure": "CALORIE"
        }
      ],
      "measure": "CALORIE",
      "startDate": "2010-10-20T12:42:03.833-04:00"
    }
    
