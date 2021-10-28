//Servidor backEnd
const env = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Note = require("./models/Note");
const app = express();
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
//const path = require("path");
//const cors = require("cors");

///conectar bbdd-->
mongoose
  .connect(
    `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASSWORD}@cluster0.1oz61.mongodb.net/${process.env.BD_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("conectado");
  })
  .catch((error) => {
    console.log(`Ha ocurrido el siguiente error: ${error}`);
  });

app.use(express.json()); // para que el back end reciba archivos json

///rutas -->
////ruta login
app.post("/login", async (req, res) => {
  let nom = req.body.nom;
  let pass = req.body.pass;
  let info_user;
  try {
    info_user = await User.find({ username: nom });
  } catch (error) {
    return res.status(500).json({
      message: "error conexion",
    });
  }
  if (info_user.length == 0) {
    return res.status(403).json({
      message: "Usuario no encontrado",
    });
  }

  bcrypt.compare(pass, info_user[0].password, (err, result) => {
    if (result == true) {
      res.json({
        auth: true,
        message: "log ok",
        userName: info_user[0].username,
        userID: info_user[0]._id,
      });
      return;
    } else if (result == false) {
      res.status(403).json({
        auth: false,
        message: "Usuario o contraseña incorrecto",
        userName: null,
        userID: null,
      });
      return;
    }
  });
});

////ruta registro
app.post("/singin", async (req, res) => {
  let new_user = req.body.nom;
  let new_pass = req.body.pass;
  let user_found;

  try {
    user_found = await User.find({ username: new_user });
  } catch (error) {
    return res.status(500).json({
      message: "error conexion",
    });
  }

  if (user_found.length == 0) {
    //comprobar si existe el nombre de usuario
    if (new_pass.length < 8) {
      //comprobar si la contraseña es buena
      res.json({
        found: true, //cuidadito
        message: "La contraseña es demasiado corta",
        userName: null,
        userPass: null,
      });
    } else {
      //añadir usuario
      //encriptar contraseña
      let new_pass_cryp = bcrypt.hashSync(new_pass, salt);
      //añadir usuario
      let newUser = { username: new_user, password: new_pass_cryp, notes: [] };
      let doc;
      try {
        doc = await User.create(newUser);
      } catch (error) {
        return res.status(500).json({
          message: "Error del servidor",
        });
      }

      res.json({
        found: false,
        message: "Nuevo usuario creado correctamente",
        userName: new_user,
        userPass: new_pass_cryp,
      });
    }
    return;
  } else {
    res.json({
      found: true,
      message: "El nombre de usuario ya existe",
      userName: null,
      userPass: null,
    });
    return;
  }
});

////ruta notas (se muestra un listado con el titulo y la fecha de la nota)
app.get("/getNotes/:userid", async (req, res) => {
  //req: lo que llega del cliente res: lo que le envias al cliente

  let userID = req.params.userid;
  let user = await User.findOne({ _id: userID }, { password: 0 })
    .populate("notes", { usernote: 0 })
    .sort({ updatedAt: -1 });

  res.json({
    userNotes: user,
  });
});

////ruta nueva nota
app.post("/newnote/:userid", async (req, res) => {
  //añadir una nueva nota a un usuario:
  //crear nueva nota en bbdd notes
  //buscar usuario en bbdd user
  //push del id de notas al array de notaas

  let user_id = req.params.userid;
  let user_note = req.body.note;
  let doc;
  try {
    //crear nota en bbdd notes
    doc = await Note.create({ usernote: user_note });
    console.log(doc);
  } catch (error) {
    return res.status(500).json({
      message: "Error del servidor",
    });
  }

  let update_user;
  try {
    update_user = await User.findByIdAndUpdate(
      user_id,
      {
        $push: { notes: doc._id },
      },
      { new: true }
    );
  } catch (error) {
    return res.json({
      message: "La nota no ha podido crearse",
    });
  }

  res.json({
    message: "nota creada",
  });
});

//ruta nota usuarioS
app.get("/note/:noteid", async (req, res) => {
  let note_id = req.params.noteid;
  let note = await Note.findOne({ _id: note_id });
  res.json({
    userNote: note,
  });
});

////ruta actualizar nota
app.put("/upnote/:noteid", async (req, res) => {
  let note_id = req.params.noteid;
  let update_note = req.body.update;
  let doc = await Note.findByIdAndUpdate(
    note_id,
    { usernote: update_note },
    { new: true }
  );

  res.json({
    message: "Nota actualizada",
    upNote: doc,
  });
});

////ruta borrar nota
app.delete("/deletenote/:noteid", async (req, res) => {
  let note_id = req.params.noteid;
  await Note.findByIdAndDelete(note_id);
  await User.findOneAndUpdate({ $pull: { notes: note_id } });

  res.json({
    message: "Nota eliminada",
  });
});

// montar servidor -->
app.listen(5000, () => {
  console.log("server listening on port 5000");
});
