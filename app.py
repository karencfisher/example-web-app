from flask import Flask, request, jsonify, render_template
import sqlite3
from pathlib import Path


app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search')
def search():
    # get month and year parameters from the URL
    month = request.args.get('month')
    year = request.args.get('year')

    # connect to the SQLite database
    conn = sqlite3.connect(Path('db/temperatures.sqlite'))
    cursor = conn.cursor()

    # generate and run the query
    sql = f'''
SELECT states.state_id, states.state, temperatures.average_temp FROM temperatures
JOIN states
ON states.state_id = temperatures.state_id
WHERE temperatures.month = {month} AND temperatures.year = {year}
'''
    results = cursor.execute(sql).fetchall()
    data = [{'code': result[0], 'state': result[1], 'avg_temp': result[2]} for result in results]    
    cursor.close()
    conn.close()

    # return the query results in JSON format    
    return jsonify(data)

@app.route('/years')
def years():
    conn = sqlite3.connect(Path('db/temperatures.sqlite'))
    cursor = conn.cursor()

    # Get the list of years
    sql = 'SELECT DISTINCT year FROM temperatures'
    results = [result[0] for result in cursor.execute(sql).fetchall()]
    cursor.close()
    conn.close()

    # return list of years in JSON format
    return jsonify({'years': results})


if __name__ == "__main__":
    app.run(debug=True)
