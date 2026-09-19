const express = require("express");
const userRouter = require("./user.router");
const repoRouter = require("./repo.router");
const issueRouter = require("./issue.router");

const mainRouter = express.Router();

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);

mainRouter.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GitHub Clone API - Status</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
        body { background-color: #0d1117; color: #f0f6fc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
        .card { background-color: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 36px; max-width: 580px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; }
        .status-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(35, 134, 54, 0.2); color: #3fb950; border: 1px solid rgba(63, 185, 80, 0.4); padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 14px; margin-bottom: 20px; }
        .status-dot { width: 10px; height: 10px; background-color: #3fb950; border-radius: 50%; box-shadow: 0 0 8px #3fb950; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.9); } }
        h1 { font-size: 26px; font-weight: 600; margin-bottom: 12px; color: #ffffff; }
        p { color: #8b949e; font-size: 15px; line-height: 1.5; margin-bottom: 24px; }
        .endpoint-list { background: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 16px; text-align: left; }
        .endpoint-item { display: flex; justify-content: space-between; font-size: 13px; font-family: monospace; padding: 6px 0; border-bottom: 1px solid #21262d; }
        .endpoint-item:last-child { border-bottom: none; }
        .method { color: #58a6ff; font-weight: bold; }
        .path { color: #e6edf3; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="status-badge">
          <span class="status-dot"></span>
          Backend API is Online & Running
        </div>
        <h1>GitHub Clone Backend Server</h1>
        <p>Your Node.js & Express API is fully active and connected to MongoDB.</p>
        
        <div class="endpoint-list">
          <div class="endpoint-item"><span class="method">GET</span> <span class="path">/repo/all</span></div>
          <div class="endpoint-item"><span class="method">POST</span> <span class="path">/repo/create</span></div>
          <div class="endpoint-item"><span class="method">GET</span> <span class="path">/issue/all</span></div>
          <div class="endpoint-item"><span class="method">POST</span> <span class="path">/login</span></div>
          <div class="endpoint-item"><span class="method">POST</span> <span class="path">/signup</span></div>
        </div>
      </div>
    </body>
    </html>
  `);
});

module.exports = mainRouter;