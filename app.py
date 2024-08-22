from flask import Flask, request, jsonify, render_template
import psycopg2
from pathlib import Path
from dotenv import load_dotenv
import os


app = Flask(__name__)
load_dotenv()
conn_string = f"dbname='us_temperatures' \
                user={os.getenv('DB_USER')} \
                password={os.getenv('DB_PASSWORD')} \
                host={os.getenv('DB_HOST')} \
                port='5432'"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search')
def search():
    # get month and year parameters from the URL
    month = request.args.get('month')
    year = request.args.get('year')

    # connect to the SQLite database
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()

    # generate and run the query
    sql = '''
    SELECT states.state_id, states.state, temperatures.average_temp 
    FROM temperatures
    JOIN states ON states.state_id = temperatures.state_id
    WHERE temperatures.month = %s AND temperatures.year = %s
    '''

    cursor.execute(sql, (month, year))
    results = cursor.fetchall()
    data = [{'code': result[0], 'state': result[1], 'avg_temp': result[2]} for result in results]    
    cursor.close()
    conn.close()

    # return the query results in JSON format    
    return jsonify(data)

@app.route('/years')
def years():
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()

    # Get the list of years
    sql = 'SELECT DISTINCT year FROM temperatures ORDER BY year'
    cursor.execute(sql)
    results = [result[0] for result in cursor.fetchall()]
    cursor.close()
    conn.close()

    # return list of years in JSON format
    return jsonify({'years': results})


if __name__ == "__main__":
    app.run(debug=True)
