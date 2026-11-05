"""Genera los script.json de los videos del modo urgente.
Los textos llevan marcas [[ruta]] (p. ej. [[cases.0]], [[msgs.3]]) que fijan el instante
(fracción del audio del beat) en que aparece ese elemento de la escena."""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / 'video' / 'src' / 'videos'
MARK = re.compile(r'\[\[([a-z]+)\.(\d+)\]\]')


def beat(bid, text, scene=None):
    clean = MARK.sub('', text)
    clean = re.sub(r'\s+', ' ', clean).strip()
    if scene is not None:
        pos = 0
        for m in MARK.finditer(text):
            frac = len(MARK.sub('', text[:m.start()])) / max(1, len(clean))
            key, idx = m.group(1), int(m.group(2))
            scene[key][idx]['at'] = round(min(0.95, frac), 3)
    b = {'id': bid, 'text': clean}
    if scene is not None:
        b['scene'] = scene
    return b


VIDEOS = {}

# ---------------------------------------------------------------- urg1
VIDEOS['urg1'] = [
    beat('b01', 'Modo urgente. Parte uno. En este video vemos cómo es el parcial, cómo sacar la lista de requerimientos y cómo identificar y graficar los procesos de negocio. Usamos el caso que tomaron en 2023 y en 2025: el alquiler de autos en Ezeiza.',
         {'type': 'title', 'title': 'Práctico 1 · Requerimientos y procesos', 'sub': 'Caso: alquiler de autos en Ezeiza (2023 y 2025)'}),
    beat('b02', 'El parcial tiene dos partes. [[items.0]]La teórica: afirmaciones verdadero o falso que hay que justificar en pocas líneas; si no justificás, no cuenta. [[items.1]]La práctica: una narrativa de negocio. [[items.2]]Y ojo: se aprueba con el sesenta por ciento de cada ítem, así que cada parte tiene que estar razonablemente bien.',
         {'type': 'cards', 'heading': 'Cómo es el parcial', 'cols': 3, 'items': [
             {'t': 'Teórica', 'd': 'V/F con justificación corta'},
             {'t': 'Práctica', 'd': 'una narrativa de negocio'},
             {'t': '60 % por ítem', 'd': 'si un ítem falla, recuperás ese ítem', 'c': '#ff5d5d'}]}),
    beat('b03', 'Los ítems que piden casi siempre son estos cuatro. [[items.0]]Uno, la lista de requerimientos. [[items.1]]Dos, los procesos de negocio, y graficar uno. [[items.2]]Tres, el diagrama de casos de uso con la descripción de un caso de uso. [[items.3]]Y cuatro, el diagrama de secuencia de ese mismo caso de uso.',
         {'type': 'flow', 'heading': 'Los 4 ítems del práctico', 'items': [
             {'t': '1 · Requerimientos', 'd': 'lista a), b), c)…'},
             {'t': '2 · Procesos', 'd': 'y graficar uno'},
             {'t': '3 · Casos de uso', 'd': 'diagrama + descripción'},
             {'t': '4 · Secuencia', 'd': 'del mismo caso de uso'}]}),
    beat('b04', 'Leamos la narrativa por párrafos. [[items.0]]La empresa alquila vehículos y quiere controlar la disponibilidad y el cobro. [[items.1]]El encargado recibe el pedido del cliente, verifica la disponibilidad, registra al cliente si es nuevo y genera el contrato. [[items.2]]Cuando el auto vuelve, se registra la devolución y se emite la factura por los días, con multa si volvió tarde. [[items.3]]Y el gerente da de alta vehículos nuevos y marca los que están en control mecánico.',
         {'type': 'cards', 'heading': 'La narrativa, por párrafos', 'cols': 2, 'items': [
             {'t': 'Objetivo', 'd': 'controlar disponibilidad y cobro de alquileres'},
             {'t': 'Alquiler', 'd': 'pedido → disponibilidad → cliente → contrato'},
             {'t': 'Devolución', 'd': 'registrar → factura por días (+ multa)'},
             {'t': 'Gerente', 'd': 'alta de vehículos · baja por control mecánico'}]}),
    beat('b05', 'Ahora la lista. El formato que usa la cátedra es corto: un ítem por proceso del negocio, que empieza con "el sistema debe gestionar". [[items.0]]La disponibilidad de los vehículos. [[items.1]]El registro de clientes. [[items.2]]Los alquileres, con el contrato. [[items.3]]La devolución. [[items.4]]La facturación y el cobro, con la multa. [[items.5]]El ingreso de vehículos nuevos. [[items.6]]Y la baja temporal por control mecánico. Nada de botones ni pantallas.',
         {'type': 'check', 'heading': 'Ítem 1 · Lista de requerimientos', 'items': [
             {'t': 'a) El sistema debe gestionar la disponibilidad de los vehículos'},
             {'t': 'b) … el registro de clientes'},
             {'t': 'c) … los alquileres (pedido y contrato)'},
             {'t': 'd) … la devolución de los vehículos'},
             {'t': 'e) … la facturación y el cobro (con multa por demora)'},
             {'t': 'f) … el ingreso de nuevos vehículos'},
             {'t': 'g) … la baja temporal por control mecánico'}]}),
    beat('b06', 'Si te piden distinguir, recordá: [[rows.0]]el funcional dice qué hace el sistema; [[rows.1]]el no funcional es una restricción sobre cómo lo hace. Por ejemplo, que la multa salga en negrita y subrayada en la factura es no funcional.',
         {'type': 'compare', 'heading': 'Funcional vs no funcional', 'left': 'Funcional', 'right': 'No funcional', 'rows': [
             {'k': 'Qué es', 'l': 'qué hace el sistema', 'r': 'restricción sobre cómo lo hace'},
             {'k': 'Ejemplo', 'l': 'gestionar la facturación con multa', 'r': 'la multa en negrita y subrayada'}]}),
    beat('b07', 'Ítem dos: los procesos de negocio. Un proceso es un conjunto de actividades que produce un resultado de valor. Acá hay tres: [[items.0]]el alquiler del vehículo, [[items.1]]la devolución con su facturación, [[items.2]]y la gestión de la flota que hace el gerente.',
         {'type': 'cards', 'heading': 'Ítem 2 · Procesos de negocio', 'cols': 3, 'items': [
             {'t': 'Alquiler', 'd': 'pedido → disponibilidad → cliente → alquiler → contrato'},
             {'t': 'Devolución y facturación', 'd': 'registrar → calcular días y multa → facturar'},
             {'t': 'Gestión de la flota', 'd': 'alta de vehículos · no disponibles por control'}]}),
    beat('b08', 'Para graficar uno se usa el diagrama de actividad, con un carril por responsable. [[steps.0]]Arranca con el círculo negro. [[steps.1]]El cliente pide un vehículo. [[steps.2]]La empresa verifica la disponibilidad. [[steps.3]]Un rombo de decisión: si no hay vehículo, se le informa y termina. [[steps.4]]Otra decisión: si el cliente no está registrado, se registran sus datos. [[steps.5]]Se registra el alquiler y se genera el contrato. [[steps.6]]El cliente recibe el contrato y el auto, [[steps.7]]y termina con el círculo con punto.',
         {'type': 'act', 'heading': 'Diagrama de actividad · proceso de alquiler', 'lanes': ['Cliente', 'Empresa (encargado + sistema)'], 'steps': [
             {'lane': 0, 'kind': 'start'},
             {'lane': 0, 'kind': 'act', 't': 'Pide un vehículo'},
             {'lane': 1, 'kind': 'act', 't': 'Verifica disponibilidad'},
             {'lane': 1, 'kind': 'dec', 't': '¿Hay vehículo?', 'no': 'Informa → fin'},
             {'lane': 1, 'kind': 'dec', 't': '¿Cliente registrado?', 'no': 'Registra al cliente'},
             {'lane': 1, 'kind': 'act', 't': 'Registra alquiler y contrato'},
             {'lane': 0, 'kind': 'act', 't': 'Recibe contrato y auto'},
             {'lane': 0, 'kind': 'end'}]}),
    beat('b09', 'Los elementos que tenés que saber nombrar: [[items.0]]estado inicial, [[items.1]]actividad, una caja redondeada; [[items.2]]decisión, un rombo con condiciones de guarda entre corchetes; [[items.3]]barra de sincronización, para actividades en paralelo; [[items.4]]estado final; [[items.5]]y los carriles, que muestran quién hace cada cosa.',
         {'type': 'cards', 'heading': 'Elementos del diagrama de actividad', 'cols': 3, 'items': [
             {'t': '● Inicio', 'd': 'círculo negro'},
             {'t': '▭ Actividad', 'd': 'caja redondeada'},
             {'t': '◇ Decisión', 'd': 'salidas con [guarda]'},
             {'t': '▬ Sincronización', 'd': 'divide o une hilos paralelos'},
             {'t': '◉ Fin', 'd': 'círculo con punto'},
             {'t': '‖ Carriles', 'd': 'quién hace cada actividad'}]}),
    beat('b10', 'Probemos. ¿Qué diagrama usás para graficar un proceso de negocio? Pensalo. [[x.0]]Es el diagrama de actividad. El de secuencia lo vamos a usar para un caso de uso, no para el proceso completo.',
         {'type': 'quiz', 'heading': 'Comprobá', 'q': '¿Con qué diagrama graficás un proceso de negocio?', 'options': ['Diagrama de secuencia', 'Diagrama de actividad', 'Diagrama de colaboración'], 'answer': 1, 'why': 'Actividad: muestra el flujo del proceso y quién hace cada paso.', 'x': [{}]}),
    beat('b11', 'Listo el ítem uno y el dos. En el próximo video armamos el diagrama de casos de uso y la descripción del caso de uso registrar pedido de alquiler.',
         {'type': 'title', 'title': 'Sigue: casos de uso y descripción', 'sub': 'Práctico 2'}),
]

# ---------------------------------------------------------------- urg2
VIDEOS['urg2'] = [
    beat('b01', 'Parte dos: el diagrama de casos de uso y la descripción. Es el ítem que más se recupera, así que vamos con el criterio exacto de la cátedra.',
         {'type': 'title', 'title': 'Práctico 2 · Casos de uso y descripción', 'sub': 'Caso: alquiler de autos'}),
    beat('b02', 'Primero, los actores. La regla de la cátedra es modelar el negocio: los actores son entidades externas. [[items.0]]El cliente es actor, porque viene de afuera y pide el alquiler. [[items.1]]El gerente también, porque inicia sus propios procesos: dar de alta vehículos y marcar los que no están disponibles. [[items.2]]El encargado que atiende no es actor: procesa el pedido, es parte del sistema, igual que el bibliotecario en Kameral. [[items.3]]Y el sistema o la factura nunca son actores.',
         {'type': 'tree', 'heading': '¿Quién es actor?', 'root': 'Narrativa', 'items': [
             {'t': 'Cliente ✔', 'd': 'externo, pide el alquiler', 'c': '#53d88a'},
             {'t': 'Gerente ✔', 'd': 'inicia alta y baja de vehículos', 'c': '#53d88a'},
             {'t': 'Encargado ✘', 'd': 'atiende: es parte del sistema', 'c': '#ff5d5d'},
             {'t': 'Sistema / Factura ✘', 'd': 'nunca son actores', 'c': '#ff5d5d'}]}),
    beat('b03', 'La profesora lo dice así: si todo empieza en el empleado, estás pensando en la computadora. Nosotros pensamos en el negocio. [[rows.0]]El actor de registrar alquiler no es el que teclea, es el cliente que quiere el auto.',
         {'type': 'compare', 'heading': 'Pensar en el negocio', 'left': 'Pensando en la compu ✘', 'right': 'Pensando en el negocio ✔', 'rows': [
             {'k': 'Actor del alquiler', 'l': 'Encargado (el que teclea)', 'r': 'Cliente (el que quiere el auto)'},
             {'k': 'Dónde queda el encargado', 'l': 'afuera, como actor', 'r': 'adentro: parte del sistema'}]}),
    beat('b04', 'Ahora dibujamos. Un rectángulo que es la frontera del sistema. Adentro, los casos de uso con verbo en infinitivo y número: [[cases.0]]caso de uso uno, registrar pedido de alquiler; [[cases.1]]caso de uso dos, registrar devolución; [[cases.2]]tres, registrar nuevo vehículo; [[cases.3]]y cuatro, indicar vehículo no disponible. Afuera, [[actors.0]]el cliente, unido [[links.0]]al alquiler [[links.1]]y a la devolución. [[actors.1]]Y el gerente, unido [[links.2]]al alta de vehículos [[links.3]]y a la baja por control mecánico.',
         {'type': 'uc', 'heading': 'Ítem 3 · Diagrama de casos de uso', 'system': 'Alquiler de vehículos (Ezeiza)',
          'actors': [{'n': 'Cliente', 'side': 'l', 'y': 300}, {'n': 'Gerente', 'side': 'r', 'y': 470}],
          'cases': [{'t': 'CU1: Registrar pedido de alquiler'}, {'t': 'CU2: Registrar devolución'}, {'t': 'CU3: Registrar nuevo vehículo'}, {'t': 'CU4: Indicar vehículo no disponible'}],
          'links': [{'a': 0, 'c': 0}, {'a': 0, 'c': 1}, {'a': 1, 'c': 2}, {'a': 1, 'c': 3}]}),
    beat('b05', 'Chequeo rápido del diagrama. [[items.0]]Actores afuera de la frontera, casos de uso adentro. [[items.1]]Nombres con verbo en infinitivo y numerados. [[items.2]]Roles, nunca nombres propios. [[items.3]]Y el include y el extend no son obligatorios en el práctico: si dudás, no los pongas.',
         {'type': 'check', 'heading': 'Checklist del diagrama', 'items': [
             {'t': 'Actores fuera del rectángulo, casos de uso dentro'},
             {'t': 'Verbo en infinitivo + objeto, numerados CU1, CU2…'},
             {'t': 'Roles (Cliente, Gerente), nunca nombres propios'},
             {'t': 'include / extend: no obligatorios en el práctico'}]}),
    beat('b06', 'Ahora la descripción del caso de uso que piden: registrar el pedido de alquiler. El encabezado tiene estos campos. [[rows.0]]Id: C U cero uno. [[rows.1]]Nombre: registrar pedido de alquiler. [[rows.2]]Actores: cliente, con P de primario, porque es quien lo inicia. [[rows.3]]Objetivo: alquilar un vehículo disponible y entregar el contrato. [[rows.4]]Precondición: el cliente se presenta en el local con sus datos. [[rows.5]]Y postcondición: el estado en que queda todo si sale bien. Alquiler registrado, vehículo no disponible y contrato generado.',
         {'type': 'desc', 'heading': 'Descripción · encabezado', 'rows': [
             {'k': 'Id', 'v': 'CU-01'},
             {'k': 'Nombre', 'v': 'Registrar pedido de alquiler'},
             {'k': 'Actores', 'v': 'Cliente (P)'},
             {'k': 'Objetivo', 'v': 'Alquilar un vehículo disponible y entregar el contrato'},
             {'k': 'Precondición', 'v': 'El cliente se presenta en el local con sus datos'},
             {'k': 'Postcondición', 'v': 'Alquiler registrado, vehículo no disponible y contrato generado'}]}),
    beat('b07', 'El flujo normal va numerado, y las reglas de negocio van como R uno, R dos, debajo del paso que las controla. [[rows.0]]Uno: el cliente solicita alquilar un vehículo. [[rows.1]]Dos: se verifica la disponibilidad, [[rows.2]]con la regla R uno: que exista un vehículo disponible. [[rows.3]]Tres: se identifica al cliente, [[rows.4]]con la regla R dos: que esté registrado. [[rows.5]]Cuatro: se registra el alquiler y el vehículo queda no disponible. [[rows.6]]Cinco: se genera el contrato. [[rows.7]]Seis: se entrega el contrato. [[rows.8]]Y F C U, fin del caso de uso.',
         {'type': 'desc', 'heading': 'Descripción · flujo normal', 'rows': [
             {'k': '1', 'v': 'Cliente solicita alquilar un vehículo (tipo y fechas)'},
             {'k': '2', 'v': 'Se verifica la disponibilidad de vehículos'},
             {'k': 'R1', 'v': 'exista un vehículo disponible para esas fechas', 'c': '#ffd166'},
             {'k': '3', 'v': 'Se identifica al cliente'},
             {'k': 'R2', 'v': 'el cliente esté registrado', 'c': '#ffd166'},
             {'k': '4', 'v': 'Se registra el alquiler; el vehículo queda no disponible'},
             {'k': '5', 'v': 'Se genera el contrato (datos del cliente y del vehículo)'},
             {'k': '6', 'v': 'Se entrega el contrato al cliente'},
             {'k': 'FCU', 'v': 'Fin del caso de uso', 'c': '#53d88a'}]}),
    beat('b08', 'Y los flujos alternativos se numeran con el número del paso donde nacen. Si falla la regla del paso dos: [[rows.0]]dos punto uno, no hay vehículo disponible; [[rows.1]]dos punto dos, se informa y se rechaza el pedido; [[rows.2]]dos punto tres, fin del caso de uso. Si falla la regla del paso tres: [[rows.3]]tres punto uno, el cliente no está registrado; [[rows.4]]tres punto dos, se registran sus datos; [[rows.5]]tres punto tres, continúa en el paso cuatro.',
         {'type': 'desc', 'heading': 'Descripción · alternativas', 'rows': [
             {'k': '2.1', 'v': 'No hay vehículo disponible', 'c': '#ff5d5d'},
             {'k': '2.2', 'v': 'Se informa al cliente y se rechaza el pedido'},
             {'k': '2.3', 'v': 'FCU'},
             {'k': '3.1', 'v': 'El cliente no está registrado', 'c': '#ff5d5d'},
             {'k': '3.2', 'v': 'Se registran los datos del cliente'},
             {'k': '3.3', 'v': 'Continúa en el paso 4'}]}),
    beat('b09', 'Pregunta típica: si el paso dos verifica la disponibilidad, ¿cómo numerás la alternativa de que no haya auto? [[x.0]]Dos punto uno, dos punto dos, y termina en F C U o en continúa en el paso tal.',
         {'type': 'quiz', 'heading': 'Comprobá', 'q': 'La alternativa del paso 2 se numera…', 'options': ['A1, A2, A3', '2.1, 2.2, 2.3 FCU', '7, 8, 9'], 'answer': 1, 'why': 'Número del paso donde nace + correlativo; termina en FCU o "continúa en…".', 'x': [{}]}),
    beat('b10', 'Ya tenés el ítem tres. En el último video del práctico hacemos el diagrama de secuencia de este mismo caso de uso, siguiendo exactamente estos pasos.',
         {'type': 'title', 'title': 'Sigue: diagrama de secuencia', 'sub': 'Práctico 3'}),
]

# ---------------------------------------------------------------- urg3
VIDEOS['urg3'] = [
    beat('b01', 'Parte tres: el diagrama de secuencia del caso de uso registrar pedido de alquiler. Tiene que seguir el mismo orden que la descripción que acabamos de escribir.',
         {'type': 'title', 'title': 'Práctico 3 · Diagrama de secuencia', 'sub': 'CU-01: Registrar pedido de alquiler'}),
    beat('b02', 'Usamos el actor y los tres estereotipos de análisis, y la cátedra pide los tres. [[items.0]]El actor, el cliente. [[items.1]]La interfaz, un círculo con una T acostada: comunica al actor con el sistema. [[items.2]]El control, un círculo con una flecha: coordina la lógica. [[items.3]]Y la entidad, un círculo con una raya abajo: la información que se guarda en el tiempo, como vehículos, clientes y alquileres.',
         {'type': 'cards', 'heading': 'Los participantes', 'cols': 2, 'items': [
             {'t': 'Actor', 'd': 'Cliente', 'c': '#ff8fab'},
             {'t': 'Interfaz ⊢○', 'd': 'Pantalla Alquiler: actor ↔ sistema', 'c': '#6ea8ff'},
             {'t': 'Control ↺', 'd': 'Control Alquiler: coordina la lógica', 'c': '#ffb35c'},
             {'t': 'Entidad ○̲', 'd': 'Vehículos · Clientes · Alquileres', 'c': '#6fd69a'}]}),
    beat('b03', 'La regla de oro de quién le habla a quién: [[items.0]]el actor solo le habla a la interfaz, [[items.1]]la interfaz al control [[items.2]]y el control a las entidades. Si el actor le habla directo a una entidad, está mal.',
         {'type': 'flow', 'heading': 'Quién le habla a quién', 'items': [
             {'t': 'Actor', 'c': '#ff8fab'}, {'t': 'Interfaz', 'c': '#6ea8ff'}, {'t': 'Control', 'c': '#ffb35c'}, {'t': 'Entidades', 'c': '#6fd69a'}],
          'note': {'t': '✘ nunca: actor → entidad', 'at': 0.8}}),
    beat('b04', 'Armemos el diagrama siguiendo la descripción. [[parts.0]]Cliente, [[parts.1]]pantalla alquiler, [[parts.2]]control alquiler, [[parts.3]]y las entidades vehículos, [[parts.4]]clientes [[parts.5]]y alquileres. Paso uno de la descripción: [[msgs.0]]el cliente solicita el alquiler a la pantalla, con tipo y fechas. Paso dos: [[msgs.1]]la pantalla le pide al control verificar disponibilidad, [[msgs.2]]y el control le pide a vehículos los disponibles. [[msgs.3]]Si no hay vehículo, con la condición entre corchetes, el control le informa a la pantalla: esa es la alternativa dos punto uno. Paso tres: [[msgs.4]]el control busca al cliente por su documento, [[msgs.5]]y si no está registrado, lo registra: la alternativa tres punto uno. Paso cuatro: [[msgs.6]]registra el alquiler [[msgs.7]]y marca el vehículo como no disponible. Paso cinco: [[msgs.8]]el control genera el contrato, un mensaje a sí mismo. Y paso seis: [[msgs.9]]el control se lo pasa a la pantalla [[msgs.10]]y la pantalla se lo entrega al cliente.',
         {'type': 'seq', 'heading': 'Ítem 4 · Secuencia de CU-01', 'parts': [
             {'n': 'Cliente', 'k': 'actor'}, {'n': 'Pantalla Alquiler', 'k': 'interface'}, {'n': 'Control Alquiler', 'k': 'control'},
             {'n': 'Vehículos', 'k': 'entity'}, {'n': 'Clientes', 'k': 'entity'}, {'n': 'Alquileres', 'k': 'entity'}],
          'msgs': [
             {'f': 0, 't': 1, 'l': 'Solicitar alquiler(tipo, fechas)'},
             {'f': 1, 't': 2, 'l': 'Verificar disponibilidad()'},
             {'f': 2, 't': 3, 'l': 'Dame vehículos disponibles()'},
             {'f': 2, 't': 1, 'l': 'Informar sin disponibilidad()', 'c': 'no hay vehículo'},
             {'f': 2, 't': 4, 'l': 'Buscar cliente(dni)'},
             {'f': 2, 't': 4, 'l': 'Registrar cliente(datos)', 'c': 'no registrado'},
             {'f': 2, 't': 5, 'l': 'Registrar alquiler()'},
             {'f': 2, 't': 3, 'l': 'Marcar no disponible()'},
             {'f': 2, 't': 2, 'l': 'Generar contrato()'},
             {'f': 2, 't': 1, 'l': 'Mostrar contrato()'},
             {'f': 1, 't': 0, 'l': 'Entregar contrato()'}]}),
    beat('b05', 'Antes de entregar, chequeá esto. [[items.0]]Es el mismo caso de uso que describiste. [[items.1]]Sigue el mismo orden que los pasos de la descripción. [[items.2]]Aparecen los tres estereotipos: interfaz, control y entidad. [[items.3]]Las condiciones van entre corchetes sobre el mensaje. [[items.4]]Y las barras de activación son opcionales: no te preocupes por ellas.',
         {'type': 'check', 'heading': 'Checklist de la secuencia', 'items': [
             {'t': 'Mismo caso de uso que la descripción'},
             {'t': 'Mismo orden que los pasos de la descripción'},
             {'t': 'Los 3 estereotipos: interfaz, control, entidad'},
             {'t': 'Condiciones entre [corchetes] sobre el mensaje'},
             {'t': 'Barras de activación: opcionales'}]}),
    beat('b06', 'Una diferencia que toman en la teoría: [[rows.0]]en el diagrama de secuencia el orden lo da el tiempo, de arriba hacia abajo. [[rows.1]]En el de colaboración los objetos se dibujan libres, y por eso es necesario numerar los mensajes.',
         {'type': 'compare', 'heading': 'Secuencia vs colaboración', 'left': 'Secuencia', 'right': 'Colaboración', 'rows': [
             {'k': 'Orden', 'l': 'por tiempo, de arriba hacia abajo', 'r': 'numerando los mensajes 1, 2, 3…'},
             {'k': 'Dibujo', 'l': 'líneas de vida verticales', 'r': 'objetos libres unidos por enlaces'}]}),
    beat('b07', 'Pregunta: el cliente le manda el primer mensaje a… [[x.0]]la interfaz. Nunca al control ni a una entidad.',
         {'type': 'quiz', 'heading': 'Comprobá', 'q': 'El Cliente envía el primer mensaje a…', 'options': ['Control Alquiler', 'Pantalla Alquiler (interfaz)', 'Vehículos (entidad)'], 'answer': 1, 'why': 'El actor solo interactúa con la interfaz.', 'x': [{}]}),
    beat('b08', 'Con esto tenés el práctico completo. Ahora practicá en la página con las preguntas de opción múltiple y después mirá el video de teoría express.',
         {'type': 'title', 'title': 'Práctico completo ✔', 'sub': 'Ahora: preguntas de práctica y teoría express'}),
]

# ---------------------------------------------------------------- urg4
VIDEOS['urg4'] = [
    beat('b01', 'Teoría express. Estas son las afirmaciones que más se repiten en los parciales, y cómo justificarlas en una o dos líneas. Recordá: primero escribís verdadero o falso, y después el porqué.',
         {'type': 'title', 'title': 'Teoría express', 'sub': 'Lo que siempre toman, con la justificación lista'}),
    beat('b02', 'Uno. El modelo de análisis es de implementación y el de diseño es conceptual. Falso: es al revés. [[rows.0]]El análisis es conceptual y describe el qué. [[rows.1]]El diseño es el esquema de implementación y describe el cómo.',
         {'type': 'compare', 'heading': '1 · Análisis vs diseño → FALSO (es al revés)', 'left': 'Análisis', 'right': 'Diseño', 'rows': [
             {'k': 'Tipo', 'l': 'conceptual', 'r': 'de implementación'},
             {'k': 'Responde', 'l': 'QUÉ debe hacer', 'r': 'CÓMO se construye'}]}),
    beat('b03', 'Dos. La extensión siempre proviene de un error o excepción. Falso. [[rows.0]]El include se ejecuta siempre. [[rows.1]]El extend se ejecuta solo bajo ciertas condiciones, y puede ser una opción, no necesariamente un error. Por ejemplo, tomar un café extiende cenar.',
         {'type': 'compare', 'heading': '2 · include vs extend → FALSO', 'left': 'include', 'right': 'extend', 'rows': [
             {'k': 'Cuándo', 'l': 'SIEMPRE se ejecuta', 'r': 'A VECES, bajo condición'},
             {'k': '¿Error?', 'l': '—', 'r': 'no necesariamente (tomar café ⟶ cenar)'}]}),
    beat('b04', 'Tres. Un actor primario en un caso de uso no puede ser secundario en otro. Falso: primario o secundario se define en cada caso de uso. [[items.0]]El primario lo inicia, [[items.1]]el secundario participa, [[items.2]]y el mismo actor puede ser primario en uno y secundario en otro.',
         {'type': 'cards', 'heading': '3 · Primario / secundario → FALSO', 'cols': 3, 'items': [
             {'t': '(P) Primario', 'd': 'inicia el caso de uso'},
             {'t': '(S) Secundario', 'd': 'participa, no lo inicia'},
             {'t': 'Relativo a cada CU', 'd': 'el mismo actor puede ser P y S', 'c': '#ffd166'}]}),
    beat('b05', 'Cuatro. La validación y verificación se hacen al finalizar el desarrollo. Falso: se hacen durante todo el ciclo, porque un error detectado tarde cuesta mucho más. [[rows.0]]Verificar es preguntarse si lo construimos bien, según la especificación. [[rows.1]]Validar es preguntarse si construimos lo correcto, lo que el cliente necesita.',
         {'type': 'compare', 'heading': '4 · V&V al final → FALSO (todo el ciclo)', 'left': 'Verificación', 'right': 'Validación', 'rows': [
             {'k': 'Pregunta', 'l': '¿lo construimos bien?', 'r': '¿construimos lo correcto?'},
             {'k': 'Contra', 'l': 'la especificación', 'r': 'lo que necesita el cliente'}]}),
    beat('b06', 'Cinco, seis y siete, de sistemas. [[items.0]]En el diagrama de colaboración es necesario numerar los mensajes: verdadero. [[items.1]]Los sistemas embebidos generalmente se escriben en ensamblador: verdadero. [[items.2]]Un embebido controla un equipo y queda oculto, como en un reloj digital: verdadero. [[items.3]]Y la correctitud y el tiempo de respuesta son más críticos en los sistemas de tiempo real, donde una respuesta correcta pero tarde es una falla.',
         {'type': 'cards', 'heading': '5–7 · Verdaderos que se repiten', 'cols': 2, 'items': [
             {'t': 'Colaboración: numerar mensajes', 'd': 'VERDADERO (no hay eje de tiempo)', 'c': '#53d88a'},
             {'t': 'Embebidos en ensamblador', 'd': 'VERDADERO (control directo del hardware)', 'c': '#53d88a'},
             {'t': 'Embebido oculto (reloj digital)', 'd': 'VERDADERO', 'c': '#53d88a'},
             {'t': 'Correcto + a tiempo', 'd': 'sistemas de TIEMPO REAL', 'c': '#ffd166'}]}),
    beat('b07', 'Ocho. Cuantificar no afecta la solución. Falso: hay que saber qué hacer y cuánto, porque un mismo problema con distintos volúmenes lleva a soluciones distintas. [[items.0]]Se cuantifican requisitos estáticos, como usuarios simultáneos, terminales y volumen de datos, [[items.1]]y dinámicos, como transacciones por período y tiempos de respuesta. Así que tampoco es cierto que solo se cuantifican entidades.',
         {'type': 'cards', 'heading': '8 · Cuantificación → FALSO "no afecta"', 'cols': 2, 'items': [
             {'t': 'Estáticos', 'd': 'usuarios simultáneos · terminales · volumen de datos'},
             {'t': 'Dinámicos', 'd': 'transacciones por período · "95 % en < 1 s"'}],
          'note': {'t': 'Distintos volúmenes → soluciones distintas', 'at': 0.25}}),
    beat('b09', 'Nueve. Atributos de una buena especificación de requerimientos, la SRS. [[items.0]]Correcta, [[items.1]]no ambigua, [[items.2]]completa, [[items.3]]verificable, [[items.4]]consistente, [[items.5]]modificable, [[items.6]]trazable [[items.7]]y anotada, por necesidad y estabilidad. Con nombrar tres y explicarlos en una línea alcanza.',
         {'type': 'cards', 'heading': '9 · Atributos de una buena SRS', 'cols': 4, 'items': [
             {'t': 'Correcta'}, {'t': 'No ambigua', 'd': 'una sola interpretación'}, {'t': 'Completa'}, {'t': 'Verificable', 'd': 'se puede comprobar'},
             {'t': 'Consistente', 'd': 'sin conflictos'}, {'t': 'Modificable'}, {'t': 'Trazable', 'd': 'origen claro'}, {'t': 'Anotada', 'd': 'esencial/deseable/opcional'}]}),
    beat('b10', 'Diez. Trazabilidad: que el origen de cada requerimiento sea claro y se pueda referenciar después. Hay cuatro tipos. [[items.0]]Hacia atrás desde los requerimientos: por qué existe cada uno. [[items.1]]Hacia adelante hasta los requerimientos: los documentos previos se referencian al SRS. [[items.2]]Hacia atrás hasta los requerimientos: cada parte del software dice qué requerimiento cumple. [[items.3]]Y hacia adelante desde los requerimientos: qué componentes satisfacen cada uno.',
         {'type': 'cards', 'heading': '10 · Trazabilidad (4 tipos)', 'cols': 2, 'items': [
             {'t': 'Atrás DESDE', 'd': 'por qué existe cada requerimiento'},
             {'t': 'Adelante HASTA', 'd': 'docs previos → SRS'},
             {'t': 'Atrás HASTA', 'd': 'software → qué requerimiento cumple'},
             {'t': 'Adelante DESDE', 'd': 'requerimiento → componentes'}]}),
    beat('b11', 'Once, los tres objetos del análisis, que siempre preguntan junto con para qué sirve el diagrama de secuencia: mostrar en el tiempo cómo colaboran los objetos para realizar un caso de uso. [[items.0]]Interfaz: comunica a los actores con el sistema. [[items.1]]Control: la lógica que no le corresponde a nadie más, y coordina. [[items.2]]Entidad: la información que se guarda en el tiempo y sobrevive al caso de uso.',
         {'type': 'cards', 'heading': '11 · Objetos de análisis', 'cols': 3, 'items': [
             {'t': 'Interfaz', 'd': 'actor ↔ sistema · círculo con T', 'c': '#6ea8ff'},
             {'t': 'Control', 'd': 'lógica y coordinación · círculo con flecha', 'c': '#ffb35c'},
             {'t': 'Entidad', 'd': 'datos persistentes · círculo con raya', 'c': '#6fd69a'}]}),
    beat('b12', 'Doce, cosas cortas. [[items.0]]Historia de usuario: como rol, quiero algo, para un beneficio. [[items.1]]Fases de prueba: unidad, integración, sistema y aceptación. [[items.2]]Métodos formales: base matemática, sin ambigüedad, para sistemas críticos; no se usan en cualquier desarrollo porque son caros y no escalan. [[items.3]]Y el estándar I E E E ochocientos treinta es la guía para especificar requerimientos, que las organizaciones adaptan.',
         {'type': 'cards', 'heading': '12 · Para cerrar', 'cols': 2, 'items': [
             {'t': 'Historia de usuario', 'd': 'Como <rol> quiero <algo> para <beneficio>'},
             {'t': 'Pruebas', 'd': 'unidad → integración → sistema → aceptación'},
             {'t': 'Métodos formales', 'd': 'matemáticos · sistemas críticos · NO en cualquier desarrollo'},
             {'t': 'IEEE 830', 'd': 'guía para la SRS, se adapta'}]}),
    beat('b13', 'Eso es todo. Ahora andá a la sección de preguntas de parciales viejos y respondelas: cada explicación trae la justificación lista para escribir. Éxitos en el parcial.',
         {'type': 'title', 'title': '¡Éxitos en el parcial!', 'sub': 'Ahora: preguntas de parciales viejos'}),
]

if __name__ == '__main__':
    voice = {'voice': 'es-AR-TomasNeural', 'rate': '+6%'}
    for vid, beats in VIDEOS.items():
        for b in beats:
            sc = b.get('scene')
            if sc and 'x' in sc:
                if sc['type'] == 'quiz':
                    sc['at'] = sc['x'][0].get('at', 0.6)
                del sc['x']
        d = ROOT / vid
        d.mkdir(parents=True, exist_ok=True)
        (d / 'script.json').write_text(json.dumps({**voice, 'beats': beats}, ensure_ascii=False, indent=1), encoding='utf-8')
        print(vid, len(beats), sum(len(b['text'].split()) for b in beats), 'palabras')
