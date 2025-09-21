import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=10000)

# import uvicorn

# if __name__ == "__main__":
#     uvicorn.run(
#         app="main:app",  # "main" is your main.py, "app" is the FastAPI instance
#         host="127.0.0.1",  # localhost only
#         port=8000,         # port number
#         reload=True        # auto-reload on code changes (development only)
#     )