define({ "api": [
  {
    "type": "post",
    "url": "/catalog/products",
    "title": "Add new product",
    "version": "1.0.0",
    "name": "Add_product",
    "group": "Products",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "String",
            "allowedValues": [
              "\"switches\"",
              "\"sensors\"",
              "\"luminaires\""
            ],
            "optional": false,
            "field": "category",
            "description": "<p>Product category</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "2..30",
            "optional": false,
            "field": "name",
            "description": "<p>Product name</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "4..16",
            "optional": false,
            "field": "brand",
            "description": "<p>Product brand</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "3..10",
            "optional": false,
            "field": "model",
            "description": "<p>Product model</p>"
          },
          {
            "group": "Request body",
            "type": "Number",
            "size": "1-500",
            "optional": false,
            "field": "price",
            "description": "<p>Product price</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "const data =  {\"category\": \"luminaires\",\n         \"name\": \"Sample name 1\",\n         \"brand\": \"Brand name 1\",\n         \"model\": \"Model name 1\",\n         \"price\": 19.99 }\n\n$http.defaults.headers.common[\"Authorization\"] = access_token;",
        "type": "js"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success response:",
          "content": "HTTPS 201 OK",
          "type": "json"
        }
      ]
    },
    "filename": "routes/catalogRouteV1.js",
    "groupTitle": "Products",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can access the endpoint.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized response:",
          "content": "HTTP 401 Unauthorized\n{\n  \"message\": \"No authorization token was found\",\n  \"error\":\n   { \"name\": 'UnauthorizedError',\n     \"message\": 'No authorization token was found',\n     \"code\": 'credentials_required',\n     \"status\": 401,\n     \"inner\": { message: 'No authorization token was found' }\n   }\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/catalog/products",
    "title": "delete product",
    "version": "1.0.0",
    "name": "Delete_product",
    "group": "Products",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "String",
            "allowedValues": [
              "\"switches\"",
              "\"sensors\"",
              "\"luminaires\""
            ],
            "optional": false,
            "field": "category",
            "description": "<p>Product category</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "2..30",
            "optional": false,
            "field": "name",
            "description": "<p>Product name</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "4..16",
            "optional": false,
            "field": "brand",
            "description": "<p>Product brand</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "3..10",
            "optional": false,
            "field": "model",
            "description": "<p>Product model</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "const data =  {\"category\": \"luminaires\",\n         \"name\": \"Sample name 1\",\n         \"brand\": \"Brand name 1\",\n         \"model\": \"Model name 1\"}\n\n$http.defaults.headers.common[\"Authorization\"] = access_token;",
        "type": "js"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success response:",
          "content": "HTTPS 201 OK",
          "type": "json"
        }
      ]
    },
    "filename": "routes/catalogRouteV1.js",
    "groupTitle": "Products",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can access the endpoint.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized response:",
          "content": "HTTP 401 Unauthorized\n{\n  \"message\": \"No authorization token was found\",\n  \"error\":\n   { \"name\": 'UnauthorizedError',\n     \"message\": 'No authorization token was found',\n     \"code\": 'credentials_required',\n     \"status\": 401,\n     \"inner\": { message: 'No authorization token was found' }\n   }\n }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/catalog/products?categories[]=switches&categories[]=sensors&sort=price-desc",
    "title": "",
    "version": "1.0.0",
    "name": "GetProducts",
    "group": "Products",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"switches\"",
              "\"sensors\"",
              "\"luminaires\""
            ],
            "optional": false,
            "field": "categories",
            "description": "<p>Filter by these categories separated by &amp;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"name-asc\"",
              "\"name-desc\"",
              "\"price-asc\"",
              "\"price-desc\""
            ],
            "optional": false,
            "field": "sort",
            "description": "<p>Sort by this</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "\"?categories[]=luminaires&categories[]=sensors&sort=price-desc\"",
          "type": "String"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "$http.defaults.headers.common[\"Authorization\"] = token;",
        "type": "js"
      }
    ],
    "success": {
      "fields": {
        "products": [
          {
            "group": "products",
            "type": "Object[]",
            "optional": false,
            "field": "Body",
            "description": "<p>Filtered and/or sorted products</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success response:",
          "content": "HTTPS 200 OK\n[{\"category\": \"luminaires\",\n     \"name\": \"Sample name 1\",\n     \"brand\": \"Brand name 1\",\n     \"model\": \"Model name 1\",\n     \"price\": 19.99 },\n {\"category\": \"sensors\",\n     \"name\": \"Sample name 2\",\n     \"brand\": \"Brand name 2\",\n     \"model\": \"Model name 2\",\n     \"price\": 59.99 }]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/catalogRouteV1.js",
    "groupTitle": "Products",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can access the endpoint.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized response:",
          "content": "HTTP 401 Unauthorized\n{\n  \"message\": \"No authorization token was found\",\n  \"error\":\n   { \"name\": 'UnauthorizedError',\n     \"message\": 'No authorization token was found',\n     \"code\": 'credentials_required',\n     \"status\": 401,\n     \"inner\": { message: 'No authorization token was found' }\n   }\n }",
          "type": "json"
        }
      ]
    }
  }
] });
