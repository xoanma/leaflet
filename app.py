from flask import Flask, jsonify, request

app = Flask(__name__)

# Datos de ejemplo
datos = [
    {"id": 1, "nombre": "Ejemplo 1"},
    {"id": 2, "nombre": "Ejemplo 2"}
]

# Ruta para obtener todos los datos
@app.route('/api/datos', methods=['GET'])
def obtener_datos():
    return jsonify({"datos": datos})

# Ruta para obtener un dato por ID
@app.route('/api/datos/<int:dato_id>', methods=['GET'])
def obtener_dato(dato_id):
    dato = next((dato for dato in datos if dato['id'] == dato_id), None)
    if dato:
        return jsonify({"dato": dato})
    else:
        return jsonify({"mensaje": "Dato no encontrado"}), 404

# Ruta para crear un nuevo dato
@app.route('/api/datos', methods=['POST'])
def crear_dato():
    nuevo_dato = {"id": len(datos) + 1, "nombre": request.json['nombre']}
    datos.append(nuevo_dato)
    return jsonify({"mensaje": "Dato creado con éxito"}), 201

# Ruta para actualizar un dato por ID
@app.route('/api/datos/<int:dato_id>', methods=['PUT'])
def actualizar_dato(dato_id):
    dato = next((dato for dato in datos if dato['id'] == dato_id), None)
    if dato:
        dato['nombre'] = request.json['nombre']
        return jsonify({"mensaje": "Dato actualizado con éxito"})
    else:
        return jsonify({"mensaje": "Dato no encontrado"}), 404

# Ruta para eliminar un dato por ID
@app.route('/api/datos/<int:dato_id>', methods=['DELETE'])
def eliminar_dato(dato_id):
    global datos
    datos = [dato for dato in datos if dato['id'] != dato_id]
    return jsonify({"mensaje": "Dato eliminado con éxito"})

if __name__ == '__main__':
    app.run(debug=True)