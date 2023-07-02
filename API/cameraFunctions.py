'''
    Functions for the camera
'''

import face_recognition
import cv2
import os
import numpy as np

def registerNewFace():
    # Definir el tamaño de la ventana
    ancho_ventana = 640
    alto_ventana = 480

    # Crear objeto de la cámara
    camera = cv2.VideoCapture(0)

    # Establecer el tamaño de captura de la cámara
    camera.set(cv2.CAP_PROP_FRAME_WIDTH, ancho_ventana)
    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, alto_ventana)

    folder_name = "faces/unknown"
    folder_number = 1
    while os.path.exists(folder_name):
        folder_name = f"faces/unknown_{folder_number}"
        folder_number += 1

    os.makedirs(folder_name)

    counter = 0
    while True:
        # Capturar un frame de la cámara
        ret, frame = camera.read()

        # Detectar las coordenadas de las caras en el frame
        face_locations = face_recognition.face_locations(frame)

        # Si se detectó alguna cara, guardar la imagen correspondiente en la carpeta
        if len(face_locations) > 0:
            # Obtener las características de las caras en el frame
            face_encodings = face_recognition.face_encodings(frame, face_locations)

            for i, face_encoding in enumerate(face_encodings):
                # Crear un nombre de archivo único para la imagen de la cara detectada
                file_name = f"{folder_name}/{counter}.jpg"

                # Guardar la imagen en la carpeta
                (top, right, bottom, left) = face_locations[i]
                face_image = frame[top:bottom, left:right]
                cv2.imwrite(file_name, face_image)
                
                counter += 1
                if counter == 4:
                    break
            
        if counter == 4:
            break
            
    # Liberar la cámara y cerrar las ventanas
    os.remove(f"{folder_name}/0.jpg")
    camera.release()
    cv2.destroyAllWindows()


def recognizePerson():
    # Definir el tamaño de la ventana
    ancho_ventana = 640
    alto_ventana = 480

    # Crear objeto de la cámara
    camera = cv2.VideoCapture(0)

    # Establecer el tamaño de captura de la cámara
    camera.set(cv2.CAP_PROP_FRAME_WIDTH, ancho_ventana)
    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, alto_ventana)

    # Leer las imágenes de las carpetas
    face_encodings = []
    folder_names = []
    for folder_name in os.listdir("faces"):
        if folder_name != "unknown":
            for file_name in os.listdir(f"faces/{folder_name}"):
                image = face_recognition.load_image_file(f"faces/{folder_name}/{file_name}")
                face_encoding = face_recognition.face_encodings(image)[0]
                face_encodings.append(face_encoding)
                folder_names.append(folder_name)

    while True:
        # Capturar un frame de la cámara
        ret, frame = camera.read()

        # Detectar las coordenadas de las caras en el frame
        face_locations = face_recognition.face_locations(frame)

        # Si se detectó alguna cara, intentar identificarla
        if len(face_locations) > 0:
            # Obtener las características de las caras en el frame
            face_encodings_in_frame = face_recognition.face_encodings(frame, face_locations)

            for i, face_encoding_in_frame in enumerate(face_encodings_in_frame):
                # Comparar la cara detectada con las caras registradas
                matches = face_recognition.compare_faces(face_encodings, face_encoding_in_frame)

                # Encontrar la cara registrada que más se parece a la cara detectada
                face_distances = face_recognition.face_distance(face_encodings, face_encoding_in_frame)
                best_match_index = np.argmin(face_distances)

                # Si hay un match, devolver el nombre de la carpeta correspondiente
                if matches[best_match_index]:
                    folder_name = folder_names[best_match_index]
                    camera.release()
                    return folder_name

        # Si no se encontró ninguna cara, devolver "unknown"
        else:
            camera.release()
            return "unknown"