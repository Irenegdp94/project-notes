//Base de datos para el desarrollo

require("dotenv").config(); // para declarar variables de entorno (global)
const mongoose = require("mongoose");
const User = require("./models/User");
const Note = require("./models/Note");

const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

//Conectar bbdd
mongoose
  .connect(
    `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASSWORD}@cluster0.1oz61.mongodb.net/${process.env.BD_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("conectado");
  })
  .catch((error) => {
    console.log("error");
  });

let passwords = ["hola", "adios", "gato", "cordoba"];
let hashes = passwords.map((password) => bcrypt.hashSync(password, salt));
let notes = [
  {
    _id: "617293951e5fb8248de98c75",
    titlenote: "Titulo nota",
    usernote:
      "Esto es una nota. Emilia Pardo-Bazán y de la Rúa-Figueroa fue una noble y novelista, periodista, feminista, ensayista, crítica literaria, poetisa, dramaturga, traductora, editora, catedrática y conferenciante española introductora del naturalismo en España. Fue una precursora en sus ideas acerca de los derechos de las mujeres y el feminismo.1​ Reivindicó la instrucción de las mujeres como algo fundamental y dedicó una parte importante de su actuación pública a defenderlo.2​ Entre su obra literaria una de las más conocidas es la novela Los pazos de Ulloa (1886).",
  },
  {
    _id: "617293951e5fb8248de65c76",
    titlenote: "Titulo nota",
    usernote:
      "Esto es una nota. Concepción Arenal Ponte fue una experta en Derecho, pensadora, periodista, poeta y autora dramática española encuadrada en el realismo literario y pionera en el feminismo español. Además, ha sido considerada la precursora del Trabajo Social en España. Perteneció a la Sociedad de San Vicente de Paul, colaborando activamente desde 1859. Defendió a través de sus publicaciones la labor llevada a cabo por las comunidades religiosas en España. Colaboró en el Boletín de la Institución Libre de Enseñanza. A lo largo de su vida y obra denunció la situación de las cárceles de hombres y mujeres, la miseria en las casas de salud o la mendicidad y la condición de la mujer en el siglo xix, en la línea de las sufragistas femeninas decimonónicas, y las precursoras del feminismo",
  },
  {
    _id: "617453951e5fb8248de65c77",
    titlenote: "Titulo nota",
    usernote:
      "Esto es una nota. Insolación: La historia se centra en Asis Taboada viuda de su tío el marqués de Andrade. La marquesa, se encuentra en Madrid pasando unos días de vacaciones. Allí conoce a Diego Pacheco, joven andaluz, soltero, atractivo y seductor al se entrega durante las fiestas de San Isidro (patrón de Madrid) y del que finalmente se enamora.",
  },
  {
    _id: "696293951e5fb8248de65c78",
    titlenote: "Titulo nota",
    usernote: "Esto es una nota.",
  },
];
let users = [
  {
    username: "Luis",
    password: hashes[0], //hola
    notes: ["617293951e5fb8248de65c76", "696293951e5fb8248de65c78"],
  },
  {
    username: "Carmen",
    password: hashes[1], //adios
    notes: ["617293951e5fb8248de65c76"],
  },
  {
    username: "Juan",
    password: hashes[2], //gato
    notes: ["617293951e5fb8248de65c76", "696293951e5fb8248de65c78"],
  },
  {
    username: "Laura",
    password: hashes[3], // cordoba
    notes: ["696293951e5fb8248de65c78"],
  },
];

const createInfo = async () => {

    let deletedNotes= await Note.deleteMany();
    console.log(deletedNotes) 
    let createdNotes = await Note.create(notes);
    console.log(createdNotes) 

    let deletedUsers= await User.deleteMany();
    console.log(deletedUsers)  
    let createdUsers = await User.create(users);
    console.log(createdUsers)

   mongoose.disconnect();
   console.log("disconnect")
}
createInfo();