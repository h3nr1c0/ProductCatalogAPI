// ------------------------------------------------------------------------------------------
// General apiDoc documentation blocks and old history blocks.
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// Current Success.
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// Current Errors.
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// Current Permissions.
// ------------------------------------------------------------------------------------------
/**
 * @apiDefine UnauthorizedError
 * @apiVersion 1.0.0
 *
 * @apiError Unauthorized Only authenticated users can access the endpoint.
 *
 * @apiErrorExample  Unauthorized response:
 *     HTTP 401 Unauthorized
 *     {
 *       "message": "No authorization token was found",
 *       "error":
 *        { "name": 'UnauthorizedError',
 *          "message": 'No authorization token was found',
 *          "code": 'credentials_required',
 *          "status": 401,
 *          "inner": { message: 'No authorization token was found' }
 *        }
 *      }
 */

// ------------------------------------------------------------------------------------------
// History.
// ------------------------------------------------------------------------------------------