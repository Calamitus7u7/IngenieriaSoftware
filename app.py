from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# --- RUTA LOGIN ---
@app.route('/procesar', methods=["POST"])
def procesar_datos():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se recibieron datos JSON'}), 400
    
    nombre_usuario = data.get('nombreUsuario', 'Desconocido') 
    mensaje_respuesta = f"¡Hola {nombre_usuario}! Saludos desde Python."
    return jsonify({'mensaje': mensaje_respuesta})

# --- RUTAS DE VISTAS (HTML) ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/registro')
def registro_pagina():
    # Esta ruta SOLO sirve para mostrar el formulario HTML
    return render_template('registro.html')

# --- NUEVA RUTA PARA CREAR USUARIO (API) ---
@app.route('/crear_usuario', methods=['POST'])
def crear_usuario():
    # 1. Recibimos los datos
    data = request.get_json()
    
    # 2. Validamos que lleguen datos
    if not data:
        return jsonify({'error': 'Los datos ingresados no pudieron ser recibidos'}), 400

    # 3. Extraemos variables
    nombre = data.get('nombreUsuario')
    apellidopaterno = data.get('apellidoPaterno')
    apellidomaterno = data.get('apellidoMaterno')
    password = data.get('password')

    # 4. Simulamos guardado (aquí iría el código de base de datos)
    print(f"Nuevo usuario registrado con éxito: {nombre}{apellidopaterno}{apellidomaterno}")

    # 5. Respondemos al JavaScript
    return jsonify({'mensaje': 'Usuario registrado exitosamente', 'status':'ok'})

if __name__ == '__main__':
    app.run(debug=True)