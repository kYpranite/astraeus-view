import simplejson
from flask import Flask, render_template, url_for
from data import scraper

# Setup flask server
app = Flask(__name__)


@app.route('/')
def main():
    return render_template("index.html")


@app.route('/getjson<kic>')
def returnJson(kic):
    try:
        obj = scraper.genStar("KIC " + kic)
        return obj.outputJson()
    except AttributeError:
        return simplejson.dumps({"error": "invalidStar"})


port = 5000

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=True)
