"use strict";
var hooks = require("hooks");
hooks.before(
  "/api/login > POST > 422 > application/json; charset=utf-8",
  function (transaction) {
    transaction.request.body = JSON.stringify({
      email: "",
      password: "",
    });
  }
);
