from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return "Hello World"


@app.route("/<kic>")
def user(kic):
    return f"Hello {kic}"


if __name__ == "__main__":
    app.run()
