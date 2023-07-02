'''
    Llamadas API para el dispensador
'''

from flask import Flask, request, jsonify
from flask_cors import CORS
import json

#from cameraFunctions import registerNewFace


app = Flask(__name__)
CORS(app)

@app.route('/api/addface', methods=['POST'])
def add_face():
    #registerNewFace()
    return

@app.route('/api/data', methods=['GET'])
def read_data():
    with open('data.json', 'r') as archivo:
        data = json.load(archivo)
    return jsonify(data)
    

@app.route('/api/data', methods=['POST'])
def update_data():
    new_data = request.json

    with open('data.json', 'r') as archivo:
        data = json.load(archivo)
    
    for medicamento in data['data']:
        if medicamento['dispenser'] == new_data['dispenser']:
            medicamento.update(new_data)

    with open('data.json', 'w') as archivo:
        json.dump(data, archivo, indent=4)

    # retornar una respuesta en formato JSON
    return jsonify({'mensaje': 'Datos recibidos correctamente'})

if __name__ == '__main__':
    app.run()