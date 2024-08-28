# COMO ENTENDER MONGODB
EL para trabajar comodamente con mongodb es necesario usar el ORM mongoose, asi como
mysql y postgresql tienen prisma, mongoose es el ORM par atrabajar con mongo

#Modelado de datos
Tenemos el siguiente modelo
![image](https://github.com/user-attachments/assets/7312a12b-7779-4240-9a9b-77684211aeb0)
Declaramos la interface de tipo User, lo denominaremos UserInter para dar una nomeclatura,
esa interface exteiende de la clase Document, esta clase es propietaria de mongo, 
lo que significa es que esta interfaz sera un documento de mongo, lo que me permite
acceso a los metodos de busqueda, de guardado y demas son bastantes y muy utiles.

Luego declaramso un esquema, este esquema declaramos los types de mongo, eso si, no confundier esso 
types que estan en el Schema, con los de TS, estos types son de mongo, como String, Boolean
y demas, cada atributo es un objeto de configuracion, ademas del tipo, podemos declarar que 
sea unica, que se le aplique trim, para que quite espacios vacios antes y despues de la cadena.

Una vez teniendo la interface y el schema hacemos que mongo, crea el modelo, segun la interfaz, 
el nombre del modelo que sera su referencia, y el esquema

# ¿Como guardo los modelos en la base de datos?
Es curioso pero mongoose a comparacion de prisma, no necesita de migraciones
solo basta con importar el modelo en tu controlador, pero si el controlador, y las 
rutas estan conectadas en tu archivo index, eso permitira que el modelo se pueda
crear en tu servidor de base de datos
# Conexion a la base de datos
El siguiente codigo, muestra como es que mongodb hace una conexion al servidor, en este caso
la cadena de conexion aparece por variables de entorno y es por que es un servido rde produccion
pero para no tener problemas, tienes que copiar la cadnea de conexion que ofrece tu localhost en mongodb compass
![image](https://github.com/user-attachments/assets/eb088c92-64ef-4f16-b9c2-942008aa076c)
![image](https://github.com/user-attachments/assets/c2df586b-d928-46ca-8e5d-c1ac9c6b9bea)
solo es copiar y pegar la cadena de conexion y colocar la base de datos, terminaria con 27017/database


# Metodos CRUD
## Creacional
Par apoder crear un nuevo registro con mongodb, hay dos opciones, por medio de instancia usando
new, o por medio de el metodo create
### Por medio de instancia
![image](https://github.com/user-attachments/assets/8a4123fe-1ceb-4f2b-af69-2221d16254ce)
### Por metodo creacional
![image](https://github.com/user-attachments/assets/5b3625a4-d926-45fd-91c5-c424f6a2b1d0)

### Lectura
Este consiste mas en una busqueda, puedes usar find() para traer todos los datos, o usar findOne({campoSchema:[valor]})
la diferencia es que al menos en el segundo, la condicion es aquel primer campo que la cumpla
pero tambien tenemos findById(id) que como su nombre lo dice,es una busqueda por id, asi a secas
cada metodo de busqeuda te regresa el documento de mongo, con todos los atributos, para no traer todo
esta el metodo select:  findById(id).select("nombre _id correo")
![image](https://github.com/user-attachments/assets/770005b8-f6f0-4055-b362-0e0c63d1aff2)
![image](https://github.com/user-attachments/assets/9b341ca5-9668-4fb6-b6d8-12adfd65d36f)
const user = await User.findOne({ email }).select("-password");
La linea anterior, puede ayudar a exluir campos, asi, si la mayoria de tus campos son los deseados
pero hay uno o tal vez dos, de esta forma no necesitas crear una nueva variable

# Actualizar
Aca tenemos mas opciones, podemos buscar el documento y actualizarlo, extraer y cambiar, o usar el metodo
findByIdAndUpdate que basicamente busca y actualiza los parametros especificados.
![image](https://github.com/user-attachments/assets/f4595dbb-b6f3-4057-9514-9a98a7add047)
Y esta es otra forma.
![image](https://github.com/user-attachments/assets/190428c9-fa1f-4338-b8ec-a3edfaea64b1)

# Eliminacion
Este no tiene mucha ciencia, ya que normalmente eliminamos por medio el id que asignamos
al documento que creamos, asi que podemos probar lo siguiente.
![image](https://github.com/user-attachments/assets/b3f98c2a-7109-4d14-9991-2629a17603bf)

## Adicional
Los inner join, y variantes del join en sql, son la magia que tiene este tipo de base de datos
traer valores de un registro segun otro registro, entonces es hora de tocar el como se hacen los joins en mongo

Supongamos que tenemos la siguiente interface
![image](https://github.com/user-attachments/assets/93432384-8b8c-45f3-a810-ecaa6b4bd417)
prestemos atencion a la clase generica Populate doc, y el type que esta adentro, y hay una union de tipos
una de ellas por ejemplo entask, el tipo es Task, y este tipo corresponde a un documento que hemos definido 
en mogno, pero agregamos la union de document, para que la interface ProeyctType asocie, task con un respectivo valor
si lo ponemos a secas asi como asi, no tiene mucho chiste, pero la importancia cae cuando haces alguna de
las busquedas anteriores

![image](https://github.com/user-attachments/assets/58448dad-5bcf-4e19-be9f-86e0bb2efbe0)
Esto que esta en la imagen es un populate especifico, seleccionas el campo al que aplicas
el join, pero a ese valor qeu ya le has aplicado el join, puedes volverle a aplicar mas joins
en este caso en el primer user, volvemos a usar populate hacia el path user, que ese valor es un
documento que gracias a completedBy, puede hacer referecia.
Esos son populates mas avanzados y especificos, pero este otro muestra como hacerlo, solo a un nivel
de anidacion, y que te traiga todos los atributos del documetno qeu etsa haciendo referencia

   const task = await Task.findById(req.task._id).populate("campo")

A lo que me refiero con "apuntar a otro documento" me refiero al parametro ref que hemos colocado
en el esquema, por ejemplo presta atencion al campo project de la siguiente imagen, este tiene 
un campo ref y es una cadema, este campo corresponde al nombre qu ele hemos pasado a un documento en la creacion
![image](https://github.com/user-attachments/assets/fd823ca3-02a7-4097-b909-e596a3efce29)

Este es el otro documento al que le hacemos la referencia, tener cuidado con las mayusculas


const Project = mongoose.model<projectType>('Project',ProyectSchema)





